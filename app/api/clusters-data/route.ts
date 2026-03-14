import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/clusters-data - 全クラスター取得
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("post_clusters")
      .select("*")
      .order("post_count", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ clusters: data });
  } catch (err) {
    console.error("Clusters fetch error:", err);
    return NextResponse.json(
      { error: "クラスターの取得に失敗しました" },
      { status: 500 }
    );
  }
}
