import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { UMAP } from "umap-js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

type VectorMapPoint = {
  id: string;
  content: string;
  author: string;
  sentiment: string;
  cluster_id: string | null;
  cluster_label: string | null;
  umap_x: number;
  umap_y: number;
};

// POST /api/vectormap - embeddingを生成してUMAP 2D座標を計算
export async function POST() {
  try {
    // 全投稿を取得
    const { data: posts, error: fetchError } = await supabase
      .from("sns_posts")
      .select("id, content, author, sentiment, cluster_id, embedding, umap_x, umap_y")
      .order("posted_at", { ascending: false });

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!posts || posts.length === 0) {
      return NextResponse.json({ error: "投稿がありません" }, { status: 400 });
    }

    // embeddingが未生成の投稿を抽出
    const needsEmbedding = posts.filter((p) => !p.embedding);

    if (needsEmbedding.length > 0) {
      // Gemini Embedding APIでバッチ処理
      const batchSize = 20;
      for (let i = 0; i < needsEmbedding.length; i += batchSize) {
        const batch = needsEmbedding.slice(i, i + batchSize);
        const contents = batch.map((p) => p.content);

        const result = await genAI
          .getGenerativeModel({ model: "text-embedding-004" })
          .batchEmbedContents({
            requests: contents.map((text) => ({
              content: { role: "user", parts: [{ text }] },
            })),
          });

        // DB更新
        for (let j = 0; j < batch.length; j++) {
          const embedding = result.embeddings[j].values;
          await supabase
            .from("sns_posts")
            .update({ embedding })
            .eq("id", batch[j].id);
          batch[j].embedding = embedding;
        }
      }
    }

    // 全投稿のembeddingを取得（更新済み）
    const allEmbeddings = posts.map(
      (p) => p.embedding as number[]
    );

    // UMAP次元削減（768次元 → 2次元）
    const umap = new UMAP({
      nNeighbors: Math.min(15, Math.max(2, posts.length - 1)),
      minDist: 0.1,
      nComponents: 2,
    });

    const coords = umap.fit(allEmbeddings);

    // DB保存 + クラスターラベル取得
    const clusterIds = [...new Set(posts.filter((p) => p.cluster_id).map((p) => p.cluster_id))];
    let clusterLabels: Record<string, string> = {};

    if (clusterIds.length > 0) {
      const { data: clusters } = await supabase
        .from("post_clusters")
        .select("id, label")
        .in("id", clusterIds);

      if (clusters) {
        clusterLabels = Object.fromEntries(clusters.map((c) => [c.id, c.label]));
      }
    }

    // UMAP座標をDBに保存 & レスポンス生成
    const points: VectorMapPoint[] = [];

    for (let i = 0; i < posts.length; i++) {
      const [x, y] = coords[i];
      await supabase
        .from("sns_posts")
        .update({ umap_x: x, umap_y: y })
        .eq("id", posts[i].id);

      points.push({
        id: posts[i].id,
        content: posts[i].content,
        author: posts[i].author,
        sentiment: posts[i].sentiment,
        cluster_id: posts[i].cluster_id,
        cluster_label: posts[i].cluster_id
          ? (clusterLabels[posts[i].cluster_id] ?? null)
          : null,
        umap_x: x,
        umap_y: y,
      });
    }

    return NextResponse.json({
      message: `${posts.length}件のベクトルマップを生成しました`,
      points,
    });
  } catch (err) {
    console.error("Vectormap error:", err);
    const errMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: `ベクトルマップ生成に失敗しました: ${errMsg}` },
      { status: 500 }
    );
  }
}

// GET /api/vectormap - 保存済みのUMAP座標を取得
export async function GET() {
  try {
    const { data: posts, error } = await supabase
      .from("sns_posts")
      .select("id, content, author, sentiment, cluster_id, umap_x, umap_y")
      .not("umap_x", "is", null)
      .order("posted_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!posts || posts.length === 0) {
      return NextResponse.json({ points: [] });
    }

    // クラスターラベル取得
    const clusterIds = [...new Set(posts.filter((p) => p.cluster_id).map((p) => p.cluster_id))];
    let clusterLabels: Record<string, string> = {};

    if (clusterIds.length > 0) {
      const { data: clusters } = await supabase
        .from("post_clusters")
        .select("id, label")
        .in("id", clusterIds);

      if (clusters) {
        clusterLabels = Object.fromEntries(clusters.map((c) => [c.id, c.label]));
      }
    }

    const points: VectorMapPoint[] = posts.map((p) => ({
      id: p.id,
      content: p.content,
      author: p.author,
      sentiment: p.sentiment,
      cluster_id: p.cluster_id,
      cluster_label: p.cluster_id
        ? (clusterLabels[p.cluster_id] ?? null)
        : null,
      umap_x: p.umap_x,
      umap_y: p.umap_y,
    }));

    return NextResponse.json({ points });
  } catch (err) {
    console.error("Vectormap fetch error:", err);
    return NextResponse.json(
      { error: "ベクトルマップの取得に失敗しました" },
      { status: 500 }
    );
  }
}
