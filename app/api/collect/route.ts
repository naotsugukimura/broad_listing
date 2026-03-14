import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { searchTweets } from "@/lib/twitter";
import { geminiModel } from "@/lib/gemini";
import { DUMMY_POSTS } from "@/lib/dummy-data";

type Sentiment = "positive" | "neutral" | "negative";

/**
 * Geminiで複数テキストの感情を一括分析
 */
async function analyzeSentiments(texts: string[]): Promise<Sentiment[]> {
  const prompt = `以下のSNS投稿それぞれの感情を分析し、"positive"、"neutral"、"negative" のいずれかで返してください。
JSON配列のみを返してください。他のテキストは不要です。

投稿一覧:
${texts.map((t, i) => `${i + 1}. ${t}`).join("\n")}

出力例: ["positive", "neutral", "negative"]`;

  const result = await geminiModel.generateContent(prompt);
  const raw = result.response.text().replace(/```json\n?|```\n?/g, "").trim();
  const sentiments: string[] = JSON.parse(raw);

  return sentiments.map((s) => {
    if (s === "positive" || s === "neutral" || s === "negative") return s;
    return "neutral";
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
      }));

      const { data, error } = await supabase
        .from("sns_posts")
        .upsert(postsToInsert, { onConflict: "content" })
        .select();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        message: `${data.length}件のダミー投稿を収集しました`,
        count: data.length,
        source: "dummy",
      });
    }

    // X APIモード
    const tweets = await searchTweets();

    if (tweets.length === 0) {
      return NextResponse.json({
        message: "該当するツイートが見つかりませんでした",
        count: 0,
        source: "x",
      });
    }

    // Geminiで感情分析
    const texts = tweets.map((t) => t.text);
    const sentiments = await analyzeSentiments(texts);

    const postsToInsert = tweets.map((tweet, i) => ({
      content: tweet.text,
      author: `@${tweet.author_username}`,
      source: "x" as const,
      posted_at: tweet.created_at,
      sentiment: sentiments[i],
    }));

    const { data, error } = await supabase
      .from("sns_posts")
      .upsert(postsToInsert, { onConflict: "content" })
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: `${data.length}件のX投稿を収集しました`,
      count: data.length,
      source: "x",
    });
  } catch (err) {
    console.error("Collect error:", err);
    return NextResponse.json(
      { error: "データ収集に失敗しました" },
      { status: 500 }
    );
  }
}
