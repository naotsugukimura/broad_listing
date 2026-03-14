import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MessageCircle, Lightbulb, BarChart3 } from "lucide-react";
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

  // 全投稿数も取得（パーセンテージ計算用）
  const [clusterResult, postsResult, totalResult] = await Promise.all([
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
    supabase
      .from("sns_posts")
      .select("id", { count: "exact", head: true }),
  ]);

  return {
    cluster: clusterResult.data as PostCluster | null,
    posts: (postsResult.data || []) as SnsPost[],
    totalPostCount: totalResult.count ?? 0,
  };
}

const relevanceColors: Record<string, string> = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  low: "bg-gray-100 text-gray-600 border-gray-200",
};

const sentimentConfig: Record<string, { label: string; color: string; bg: string }> = {
  positive: { label: "ポジティブ", color: "text-green-700", bg: "bg-green-50 border-green-200" },
  neutral: { label: "中立", color: "text-gray-700", bg: "bg-gray-50 border-gray-200" },
  negative: { label: "ネガティブ", color: "text-red-700", bg: "bg-red-50 border-red-200" },
};

export default async function ClusterDetailPage({ params }: Props) {
  const { clusterId } = await params;
  const { cluster, posts, totalPostCount } = await getClusterData(clusterId);

  if (!cluster) {
    notFound();
  }

  const totalSentiment =
    cluster.sentiment_distribution.positive +
    cluster.sentiment_distribution.neutral +
    cluster.sentiment_distribution.negative;

  const percentage = totalPostCount > 0
    ? Math.round((cluster.post_count / totalPostCount) * 100)
    : 0;

  // 代表投稿を先頭に、それ以外を後に
  const representativeIds = new Set(cluster.representative_posts || []);
  const representativePosts = posts.filter((p) => representativeIds.has(p.id));
  const otherPosts = posts.filter((p) => !representativeIds.has(p.id));

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

      {/* ── ヘッダー: クラスター名 + 統計 ── */}
      <div className="rounded-lg border bg-gradient-to-r from-blue-50 to-white p-6">
        <div className="flex flex-wrap items-start gap-3">
          <h2 className="text-2xl font-bold text-gray-900">{cluster.label}</h2>
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

        <p className="mt-1 text-sm text-gray-500">
          ({cluster.post_count} 議論, {percentage}% 合計)
        </p>

        {/* クラスター分析サマリー */}
        <div className="mt-4">
          <h3 className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-gray-700">
            <BarChart3 className="h-4 w-4" />
            クラスター分析:
          </h3>
          <p className="text-sm leading-relaxed text-gray-700">
            {cluster.summary}
          </p>
        </div>

        {/* 感情分布バー */}
        <div className="mt-4">
          <div className="mb-2 flex h-3 overflow-hidden rounded-full">
            {totalSentiment > 0 && (
              <>
                <div
                  className="bg-green-500 transition-all"
                  style={{ width: `${(cluster.sentiment_distribution.positive / totalSentiment) * 100}%` }}
                />
                <div
                  className="bg-gray-400 transition-all"
                  style={{ width: `${(cluster.sentiment_distribution.neutral / totalSentiment) * 100}%` }}
                />
                <div
                  className="bg-red-500 transition-all"
                  style={{ width: `${(cluster.sentiment_distribution.negative / totalSentiment) * 100}%` }}
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
        </div>
      </div>

      {/* ── アクション提案 ── */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="flex gap-3 p-4">
          <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
          <div>
            <p className="text-sm font-medium text-blue-800">
              アクション提案
            </p>
            <p className="mt-1 text-sm text-blue-700">
              {cluster.business_relevance.actionable_insight}
            </p>
            <p className="mt-2 text-xs text-blue-600">
              関連理由: {cluster.business_relevance.reason}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ── 代表的なコメント ── */}
      {representativePosts.length > 0 && (
        <div>
          <h3 className="mb-3 flex items-center gap-1.5 text-lg font-semibold">
            <MessageCircle className="h-5 w-5 text-blue-600" />
            代表的なコメント:
          </h3>
          <ul className="space-y-2">
            {representativePosts.map((post) => (
              <li key={post.id} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                <div className="flex-1">
                  <p className="text-sm leading-relaxed text-gray-800">
                    {post.content}
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                    <span>{post.author}</span>
                    <span className={sentimentConfig[post.sentiment]?.color}>
                      {sentimentConfig[post.sentiment]?.label}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── その他のコメント ── */}
      <div>
        <h3 className="mb-3 text-lg font-semibold">
          {representativePosts.length > 0
            ? `その他のコメント (${otherPosts.length}件)`
            : `所属投稿 (${posts.length}件)`}
        </h3>
        <div className="space-y-2">
          {(representativePosts.length > 0 ? otherPosts : posts).map((post) => {
            const date = new Date(post.posted_at);
            const formatted = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
            const sc = sentimentConfig[post.sentiment];

            return (
              <Card key={post.id} className="transition-shadow hover:shadow-sm">
                <CardContent className="p-3">
                  <p className="text-sm leading-relaxed text-gray-800">
                    {post.content}
                  </p>
                  <div className="mt-1.5 flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <span>{post.author}</span>
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
