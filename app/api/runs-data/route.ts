import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/runs-data - クラスタリング実行履歴取得
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("clustering_runs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ runs: data });
  } catch (err) {
    console.error("Runs fetch error:", err);
    return NextResponse.json(
      { error: "実行履歴の取得に失敗しました" },
      { status: 500 }
    );
  }
}
