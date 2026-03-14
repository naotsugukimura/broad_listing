import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/posts - 投稿一覧取得（クエリパラメータでフィルタ）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clusterId = searchParams.get("cluster_id");
    const limit = parseInt(searchParams.get("limit") || "100", 10);

    let query = supabase
      .from("sns_posts")
      .select("*")
      .not("tweet_url", "is", null)
      .order("posted_at", { ascending: false })
      .limit(limit);

    if (clusterId) {
      query = query.eq("cluster_id", clusterId);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ posts: data, count: data?.length || 0 });
  } catch (err) {
    console.error("Posts fetch error:", err);
    return NextResponse.json(
      { error: "投稿の取得に失敗しました" },
      { status: 500 }
    );
  }
}
