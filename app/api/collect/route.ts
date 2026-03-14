import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { searchTweets } from "@/lib/twitter";
import { geminiModel } from "@/lib/gemini";
import { DUMMY_POSTS } from "@/lib/dummy-data";
import { buildSentimentPrompt } from "@/lib/sentiment-prompt";
import type { AspectSentiment, EmotionScores, SoftwareName, ServiceType } from "@/types";

type Sentiment = "positive" | "neutral" | "negative";

type EnhancedAnalysis = {
  sentiment: Sentiment;
  sentiment_score: number;
  sentiment_reason: string;
  software_mentioned: SoftwareName[];
  service_types: ServiceType[];
  aspect_sentiments: AspectSentiment[];
  emotion_scores: EmotionScores;
  key_keywords: string[];
};

/**
 * Geminiで拡張感情分析 v2
 *
 * v1からの改善:
 * - アスペクト感情を5段階スコア化（3値→1-5）
 * - 全判定にCoT（Chain of Thought）理由を必須化
 * - 皮肉・スラング・混合評価の明示的ルール
 * - 障害福祉ドメイン文脈の注入
 * - サービス種別の自動検出
 * - キーワード抽出
 */
async function analyzeEnhanced(texts: string[]): Promise<EnhancedAnalysis[]> {
  const prompt = buildSentimentPrompt(texts);

  const result = await geminiModel.generateContent(prompt);
  const raw = result.response.text().replace(/```json\n?|```\n?/g, "").trim();
  const analyses: EnhancedAnalysis[] = JSON.parse(raw);

  const defaultEmotions: EmotionScores = {
    joy: 0, trust: 0, anticipation: 0, surprise: 0,
    fear: 0, sadness: 0, anger: 0, disgust: 0,
  };

  return analyses.map((a) => {
    // sentiment_scoreから3値sentimentを導出（フォールバック）
    const score = typeof a.sentiment_score === "number" ? a.sentiment_score : 3;
    const derivedSentiment: Sentiment =
      score <= 2 ? "negative" : score >= 4 ? "positive" : "neutral";
    const rawSentiment = a.sentiment;
    const sentiment = (["positive", "neutral", "negative"].includes(rawSentiment)
      ? rawSentiment
      : derivedSentiment) as Sentiment;

    // アスペクトのsentimentもscoreから導出（scoreがある場合）
    const aspects = Array.isArray(a.aspect_sentiments)
      ? a.aspect_sentiments.map((asp) => {
          if (typeof asp.score === "number" && asp.score >= 1 && asp.score <= 5) {
            const aspSentiment: Sentiment =
              asp.score <= 2 ? "negative" : asp.score >= 4 ? "positive" : "neutral";
            return { ...asp, sentiment: aspSentiment };
          }
          return asp;
        })
      : [];

    return {
      sentiment,
      sentiment_score: score,
      sentiment_reason: a.sentiment_reason ?? "",
      software_mentioned: Array.isArray(a.software_mentioned) ? a.software_mentioned : [],
      service_types: Array.isArray(a.service_types) ? a.service_types : ["unknown"],
      aspect_sentiments: aspects,
      emotion_scores: a.emotion_scores ?? defaultEmotions,
      key_keywords: Array.isArray(a.key_keywords) ? a.key_keywords : [],
    };
  });
}

// POST /api/collect - X APIまたはダミーデータを収集
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const mode = (body as { mode?: string }).mode ?? "x";

    // ダミーモード
    if (mode === "dummy" || !process.env.X_BEARER_TOKEN) {
      const postsToInsert = DUMMY_POSTS.map((post) => ({
        content: post.content,
        author: post.author,
        source: "dummy" as const,
        posted_at: post.posted_at,
        sentiment: post.sentiment,
        software_mentioned: post.software_mentioned,
        aspect_sentiments: post.aspect_sentiments,
        emotion_scores: post.emotion_scores,
      }));

      const { data, error } = await supabase
        .from("sns_posts")
        .upsert(postsToInsert, { onConflict: "content" })
        .select();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        message: `${data.length}件のダミー投稿を収集しました（6ソフト+未使用者、ABSA・Plutchik感情分析付き）`,
        count: data.length,
        source: "dummy",
      });
    }

    // X APIモード
    let tweets;
    try {
      tweets = await searchTweets();
    } catch (xError) {
      console.error("X API error, falling back to dummy:", xError);
      const postsToInsert = DUMMY_POSTS.map((post) => ({
        content: post.content,
        author: post.author,
        source: "dummy" as const,
        posted_at: post.posted_at,
        sentiment: post.sentiment,
        software_mentioned: post.software_mentioned,
        aspect_sentiments: post.aspect_sentiments,
        emotion_scores: post.emotion_scores,
      }));

      const { data, error } = await supabase
        .from("sns_posts")
        .upsert(postsToInsert, { onConflict: "content" })
        .select();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      const errMsg = xError instanceof Error ? xError.message : String(xError);
      return NextResponse.json({
        message: `X API接続エラーのためダミーデータ${data.length}件を使用（${errMsg}）`,
        count: data.length,
        source: "dummy",
        xError: errMsg,
      });
    }

    if (tweets.length === 0) {
      return NextResponse.json({
        message: "該当するツイートが見つかりませんでした",
        count: 0,
        source: "x",
      });
    }

    // Geminiで拡張感情分析（ABSA + Plutchik + ソフトウェア検出）
    const texts = tweets.map((t) => t.text);
    const analyses = await analyzeEnhanced(texts);

    const postsToInsert = tweets.map((tweet, i) => ({
      content: tweet.text,
      author: `@${tweet.author_username}`,
      source: "x" as const,
      posted_at: tweet.created_at,
      sentiment: analyses[i].sentiment,
      software_mentioned: analyses[i].software_mentioned,
      aspect_sentiments: analyses[i].aspect_sentiments,
      emotion_scores: analyses[i].emotion_scores,
      sentiment_score: analyses[i].sentiment_score,
      sentiment_reason: analyses[i].sentiment_reason,
      service_types: analyses[i].service_types,
      key_keywords: analyses[i].key_keywords,
      search_tier: tweet.search_tier ?? null,
    }));

    const { data, error } = await supabase
      .from("sns_posts")
      .upsert(postsToInsert, { onConflict: "content" })
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: `${data.length}件のX投稿を収集しました（ABSA・Plutchik感情分析付き）`,
      count: data.length,
      source: "x",
    });
  } catch (err) {
    console.error("Collect error:", err);
    const errMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: `データ収集に失敗しました: ${errMsg}` },
      { status: 500 }
    );
  }
}
