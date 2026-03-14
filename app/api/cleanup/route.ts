import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// POST /api/cleanup - ダミーデータとtweet_urlがないデータを削除
export async function POST() {
  try {
    // 1. ダミーデータ（source="dummy"）を削除
    const { count: dummyCount, error: dummyError } = await supabase
      .from("sns_posts")
      .delete({ count: "exact" })
      .eq("source", "dummy");

    if (dummyError) {
      return NextResponse.json({ error: dummyError.message }, { status: 500 });
    }

    // 2. tweet_urlがnullのデータ（古い形式のX投稿）も削除
    const { count: noUrlCount, error: noUrlError } = await supabase
      .from("sns_posts")
      .delete({ count: "exact" })
      .is("tweet_url", null);

    if (noUrlError) {
      return NextResponse.json({ error: noUrlError.message }, { status: 500 });
    }

    const totalDeleted = (dummyCount ?? 0) + (noUrlCount ?? 0);

    return NextResponse.json({
      message: `${totalDeleted}件のデータを削除しました（ダミー: ${dummyCount ?? 0}件、URL無し: ${noUrlCount ?? 0}件）`,
      deleted: totalDeleted,
      dummyDeleted: dummyCount ?? 0,
      noUrlDeleted: noUrlCount ?? 0,
    });
  } catch (err) {
    console.error("Cleanup error:", err);
    const errMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: `クリーンアップに失敗しました: ${errMsg}` },
      { status: 500 }
    );
  }
}
