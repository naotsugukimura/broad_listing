import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { searchTweets } from "@/lib/twitter";
import { geminiModel } from "@/lib/gemini";
import { DUMMY_POSTS } from "@/lib/dummy-data";
import type { AspectSentiment, EmotionScores, SoftwareName } from "@/types";

type Sentiment = "positive" | "neutral" | "negative";

type EnhancedAnalysis = {
  sentiment: Sentiment;
  software_mentioned: SoftwareName[];
  aspect_sentiments: AspectSentiment[];
  emotion_scores: EmotionScores;
};

/**
 * Geminiで拡張感情分析（ABSA + Plutchik + ソフトウェア検出）
 *
 * 学術的根拠:
 * - ABSA: Pontiki et al. (2016) SemEval-2016 Task 5
 * - Plutchik: Plutchik (1980) "Emotion: A Psychoevolutionary Synthesis"
 * - 日本語感情: WRIME Dataset (Kajiwara et al., 2021)
 */
async function analyzeEnhanced(texts: string[]): Promise<EnhancedAnalysis[]> {
  const prompt = `あなたは感情分析の専門AIです。以下の学術的フレームワークに基づいて分析してください。

## 分析フレームワーク

### 1. 全体感情（3値分類）
投稿全体の感情を "positive"、"neutral"、"negative" のいずれかで判定。

### 2. Plutchikの感情の輪（8基本感情・WRIME準拠）
各感情を0〜3の強度で評価（0=なし、1=弱い、2=中程度、3=強い）。
- joy（喜び）: 満足感、嬉しさ、達成感
- trust（信頼）: 安心感、信頼性、頼もしさ
- anticipation（期待）: 前向きな展望、楽しみ
- surprise（驚き）: 予想外の発見、意外さ
- fear（不安）: 心配、恐れ、リスク懸念
- sadness（悲しみ）: 失望、残念、諦め
- anger（怒り）: 不満、苛立ち、憤り
- disgust（嫌悪）: 拒否感、うんざり

### 3. アスペクトベース感情分析（ABSA）
投稿内で言及されている機能・側面を抽出し、それぞれの感情を評価。
機能カテゴリ（該当するもののみ）:
- billing: 請求機能
- recording: 記録管理
- care_plan: 支援計画
- ui_ux: 操作性・UI
- support: サポート
- pricing: 価格
- mobile: モバイル
- data_migration: データ移行
- reporting: 帳票・レポート

### 4. ソフトウェア言及検出
- kabenashi: かべなしクラウド
- honobono: ほのぼの NEXT / ほのぼの
- kaishu: 介舟ファミリー / 介舟
- knoube: ノウビー / Knoube
- hug: HUG / ネットアーツ
- wiseman: ワイズマン
- none: ソフト未使用（Excel・紙運用の文脈）

## 分析対象
${texts.map((t, i) => `[${i}] ${t}`).join("\n")}

## 出力（JSON配列のみ）
[
  {
    "sentiment": "positive",
    "software_mentioned": ["kabenashi"],
    "aspect_sentiments": [
      {"aspect": "billing", "sentiment": "positive", "detail": "請求時間が半減"}
    ],
    "emotion_scores": {"joy": 2, "trust": 3, "anticipation": 0, "surprise": 1, "fear": 0, "sadness": 0, "anger": 0, "disgust": 0}
  }
]`;

  const result = await geminiModel.generateContent(prompt);
  const raw = result.response.text().replace(/```json\n?|```\n?/g, "").trim();
  const analyses: EnhancedAnalysis[] = JSON.parse(raw);

  const defaultEmotions: EmotionScores = {
    joy: 0, trust: 0, anticipation: 0, surprise: 0,
    fear: 0, sadness: 0, anger: 0, disgust: 0,
  };

  return analyses.map((a) => ({
    sentiment: (["positive", "neutral", "negative"].includes(a.sentiment) ? a.sentiment : "neutral") as Sentiment,
    software_mentioned: Array.isArray(a.software_mentioned) ? a.software_mentioned : [],
    aspect_sentiments: Array.isArray(a.aspect_sentiments) ? a.aspect_sentiments : [],
    emotion_scores: a.emotion_scores ?? defaultEmotions,
  }));
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
