import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { geminiModel } from "@/lib/gemini";
import { buildClusteringPrompt } from "@/lib/clustering-prompt";
import type { GeminiClusterResponse } from "@/types";

// POST /api/cluster - Geminiでクラスタリング実行
export async function POST() {
  try {
    // 1. 未クラスタリング投稿を取得
    const { data: posts, error: fetchError } = await supabase
      .from("sns_posts")
      .select("*")
      .is("cluster_id", null)
      .order("posted_at", { ascending: true });

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!posts || posts.length === 0) {
      return NextResponse.json(
        { message: "クラスタリング対象の投稿がありません" },
        { status: 200 }
      );
    }

    // 2. clustering_runレコード作成
    const { data: run, error: runError } = await supabase
      .from("clustering_runs")
      .insert({
        status: "processing",
        total_posts: posts.length,
      })
      .select()
      .single();

    if (runError || !run) {
      return NextResponse.json(
        { error: "クラスタリング実行の作成に失敗しました" },
        { status: 500 }
      );
    }

    // 3. Geminiにクラスタリングプロンプト送信
    const indexedPosts = posts.map((p, i) => ({
      index: i,
      content: p.content,
    }));

    const prompt = buildClusteringPrompt(indexedPosts);
    const result = await geminiModel.generateContent(prompt);
    const responseText = result.response.text();

    // JSONパース
    const cleanJson = responseText.replace(/```json|```/g, "").trim();
    let clusterResponse: GeminiClusterResponse;
    try {
      clusterResponse = JSON.parse(cleanJson);
    } catch {
      // runをfailedに更新
      await supabase
        .from("clustering_runs")
        .update({ status: "failed" })
        .eq("id", run.id);

      return NextResponse.json(
        { error: "Geminiのレスポンスのパースに失敗しました", raw: cleanJson },
        { status: 500 }
      );
    }

    // 4. 結果をpost_clustersに保存
    for (const cluster of clusterResponse.clusters) {
      const representativePosts = cluster.representative_post_indices
        .map((idx) => posts[idx]?.content)
        .filter(Boolean);

      const { data: clusterRecord, error: clusterError } = await supabase
        .from("post_clusters")
        .insert({
          run_id: run.id,
          label: cluster.label,
          summary: cluster.summary,
          category: cluster.category,
          post_count: cluster.post_indices.length,
          sentiment_distribution: cluster.sentiment_distribution,
          business_relevance: cluster.business_relevance,
          representative_posts: representativePosts,
          feature_analysis: cluster.feature_analysis ?? [],
        })
        .select()
        .single();

      if (clusterError || !clusterRecord) {
        console.error("Cluster insert error:", clusterError);
        continue;
      }

      // sns_postsのcluster_id更新
      const postIds = cluster.post_indices
        .map((idx) => posts[idx]?.id)
        .filter(Boolean);

      if (postIds.length > 0) {
        await supabase
          .from("sns_posts")
          .update({ cluster_id: clusterRecord.id })
          .in("id", postIds);
      }
    }

    // runを完了に更新
    await supabase
      .from("clustering_runs")
      .update({
        status: "completed",
        cluster_count: clusterResponse.clusters.length,
        completed_at: new Date().toISOString(),
      })
      .eq("id", run.id);

    return NextResponse.json({
      message: "クラスタリングが完了しました",
      run_id: run.id,
      cluster_count: clusterResponse.clusters.length,
      total_posts: posts.length,
    });
  } catch (err) {
    console.error("Clustering error:", err);
    return NextResponse.json(
      { error: "クラスタリング処理に失敗しました" },
      { status: 500 }
    );
  }
}
