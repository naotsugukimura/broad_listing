import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CATEGORY_LABELS } from "@/types";
import type { PostCluster, SnsPost } from "@/types";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ clusterId: string }>;
};

async function getClusterData(clusterId: string) {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const [clusterResult, postsResult] = await Promise.all([
    supabase
      .from("post_clusters")
      .select("*")
      .eq("id", clusterId)
      .single(),
    supabase
      .from("sns_posts")
      .select("*")
      .eq("cluster_id", clusterId)
      .order("posted_at", { ascending: false }),
  ]);

  return {
    cluster: clusterResult.data as PostCluster | null,
    posts: (postsResult.data || []) as SnsPost[],
  };
}

const relevanceColors: Record<string, string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-gray-100 text-gray-600",
};

const sentimentConfig: Record<string, { label: string; shape: string; color: string }> = {
  positive: { label: "ポジティブ", shape: "triangle-up", color: "text-green-600" },
  neutral: { label: "中立", shape: "circle", color: "text-gray-600" },
  negative: { label: "ネガティブ", shape: "triangle-down", color: "text-red-600" },
};

export default async function ClusterDetailPage({ params }: Props) {
  const { clusterId } = await params;
  const { cluster, posts } = await getClusterData(clusterId);

  if (!cluster) {
    notFound();
  }

  const totalSentiment =
    cluster.sentiment_distribution.positive +
    cluster.sentiment_distribution.neutral +
    cluster.sentiment_distribution.negative;

  return (
    <div className="space-y-6">
      {/* 戻るリンク */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        ダッシュボードに戻る
      </Link>

      {/* クラスター情報 */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-start gap-3">
          <h2 className="text-2xl font-bold">{cluster.label}</h2>
          <Badge variant="secondary">
            {CATEGORY_LABELS[cluster.category]}
          </Badge>
          <Badge
            variant="outline"
            className={relevanceColors[cluster.business_relevance.level]}
          >
            重要度: {cluster.business_relevance.level === "high" ? "高" : cluster.business_relevance.level === "medium" ? "中" : "低"}
          </Badge>
        </div>

        <p className="text-gray-700">{cluster.summary}</p>

        {/* ビジネス関連性 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">ビジネス分析</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="text-sm font-medium text-gray-500">関連理由: </span>
              <span className="text-sm">{cluster.business_relevance.reason}</span>
            </div>
            <div className="rounded bg-blue-50 p-3">
              <span className="text-sm font-medium text-blue-700">
                アクション提案:
              </span>
              <p className="mt-1 text-sm text-blue-700">
                {cluster.business_relevance.actionable_insight}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 感情分布 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">感情分布</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-3 flex h-4 overflow-hidden rounded-full">
              {totalSentiment > 0 && (
                <>
                  <div
                    className="bg-green-500"
                    style={{
                      width: `${(cluster.sentiment_distribution.positive / totalSentiment) * 100}%`,
                    }}
                  />
                  <div
                    className="bg-gray-400"
                    style={{
                      width: `${(cluster.sentiment_distribution.neutral / totalSentiment) * 100}%`,
                    }}
                  />
                  <div
                    className="bg-red-500"
                    style={{
                      width: `${(cluster.sentiment_distribution.negative / totalSentiment) * 100}%`,
                    }}
                  />
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-4">
              {(["positive", "neutral", "negative"] as const).map((s) => {
                const count = cluster.sentiment_distribution[s];
                const c = sentimentConfig[s];
                return (
                  <div key={s} className={`flex items-center gap-1 ${c.color}`}>
                    <SentimentShape type={s} />
                    <span className="text-sm">
                      {c.label}: {count}件
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 所属投稿一覧 */}
      <div>
        <h3 className="mb-3 text-lg font-semibold">
          所属投稿 ({posts.length}件)
        </h3>
        <div className="space-y-3">
          {posts.map((post) => {
            const date = new Date(post.posted_at);
            const formatted = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
            const sc = sentimentConfig[post.sentiment];

            return (
              <Card key={post.id}>
                <CardContent className="space-y-2 p-4">
                  <p className="text-sm leading-relaxed text-gray-800">
                    {post.content}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <span>@{post.author}</span>
                      <span>{formatted}</span>
                    </div>
                    <span className={`flex items-center gap-1 ${sc.color}`}>
                      <SentimentShape type={post.sentiment} />
                      {sc.label}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// 形状コンポーネント（Server Component内で使用するためインライン定義）
function SentimentShape({ type }: { type: "positive" | "neutral" | "negative" }) {
  const size = 14;
  if (type === "positive") {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden="true">
        <polygon points="8,2 14,14 2,14" fill="currentColor" />
      </svg>
    );
  }
  if (type === "neutral") {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="8" r="6" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden="true">
      <polygon points="2,2 14,2 8,14" fill="currentColor" />
    </svg>
  );
}
