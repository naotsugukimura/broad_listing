import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { DUMMY_POSTS } from "@/lib/dummy-data";

// POST /api/collect - ダミーデータをSupabaseに投入
// Phase 1: ダミーデータを使用。X API取得後は lib/twitter.ts を作成して差し替え
export async function POST() {
  try {
    const postsToInsert = DUMMY_POSTS.map((post) => ({
      content: post.content,
      author: post.author,
      source: "dummy" as const,
      posted_at: post.posted_at,
      sentiment: post.sentiment,
    }));

    // contentで重複排除（upsert）
    const { data, error } = await supabase
      .from("sns_posts")
      .upsert(postsToInsert, { onConflict: "content" })
      .select();

    if (error) {
      console.error("Supabase upsert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: `${data.length}件の投稿を収集しました`,
      count: data.length,
    });
  } catch (err) {
    console.error("Collect error:", err);
    return NextResponse.json(
      { error: "データ収集に失敗しました" },
      { status: 500 }
    );
  }
}
