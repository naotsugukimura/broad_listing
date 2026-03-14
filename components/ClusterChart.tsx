"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, MessageCircle, BarChart3 } from "lucide-react";
import { CATEGORY_LABELS } from "@/types";
import type { PostCluster, SnsPost } from "@/types";

type Props = {
  clusters: PostCluster[];
  posts: SnsPost[];
};

const sentimentConfig: Record<string, { label: string; color: string }> = {
  positive: { label: "ポジティブ", color: "text-green-600" },
  neutral: { label: "中立", color: "text-gray-500" },
  negative: { label: "ネガティブ", color: "text-red-600" },
};

const relevanceLabels: Record<string, string> = {
  high: "高", medium: "中", low: "低",
};

export function ClusterChart({ clusters, posts }: Props) {
  const [selectedCluster, setSelectedCluster] = useState<PostCluster | null>(null);

  const data = clusters.map((c) => ({
    id: c.id,
    name: c.label.length > 10 ? c.label.slice(0, 10) + "..." : c.label,
    fullName: c.label,
    positive: c.sentiment_distribution.positive,
    neutral: c.sentiment_distribution.neutral,
    negative: c.sentiment_distribution.negative,
    total: c.post_count,
  }));

  // 選択クラスターの代表コメントを取得
  const representativeIds = new Set(selectedCluster?.representative_posts || []);
  const representativePosts = posts.filter((p) => representativeIds.has(p.id));
  // 代表コメントがない場合はクラスター所属投稿を表示（最大5件）
  const clusterPosts = selectedCluster
    ? posts.filter((p) => p.cluster_id === selectedCluster.id)
    : [];
  const displayPosts = representativePosts.length > 0
    ? representativePosts
    : clusterPosts.slice(0, 5);

  const totalSentiment = selectedCluster
    ? selectedCluster.sentiment_distribution.positive +
      selectedCluster.sentiment_distribution.neutral +
      selectedCluster.sentiment_distribution.negative
    : 0;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">クラスター別 投稿数・感情分布</CardTitle>
          <p className="text-xs text-gray-500">
            棒グラフをクリックすると、そのクラスターの詳細・代表コメントを確認できます
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={data}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              style={{ cursor: "pointer" }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={60}
              />
              {/* 原点0から開始（デジタル庁ガイドライン） */}
              <YAxis allowDecimals={false} domain={[0, "auto"]} />
              <Tooltip
                formatter={(value, name) => {
                  const labels: Record<string, string> = {
                    positive: "ポジティブ",
                    neutral: "中立",
                    negative: "ネガティブ",
                  };
                  return [value, labels[String(name)] || name];
                }}
                labelFormatter={(_label, payload) => {
                  if (payload && payload[0]) {
                    return payload[0].payload.fullName;
                  }
                  return _label;
                }}
              />
              <Legend
                formatter={(value: string) => {
                  const labels: Record<string, string> = {
                    positive: "ポジティブ",
                    neutral: "中立",
                    negative: "ネガティブ",
                  };
                  return labels[value] || value;
                }}
              />
              <Bar
                dataKey="positive"
                stackId="a"
                fill="#22c55e"
                name="positive"
                onClick={(_data, _index, e) => {
                  void e;
                  const barData = _data as unknown as { id: string };
                  const cluster = clusters.find((c) => c.id === barData.id);
                  if (cluster) setSelectedCluster(cluster);
                }}
              />
              <Bar
                dataKey="neutral"
                stackId="a"
                fill="#9ca3af"
                name="neutral"
                onClick={(_data, _index, e) => {
                  void e;
                  const barData = _data as unknown as { id: string };
                  const cluster = clusters.find((c) => c.id === barData.id);
                  if (cluster) setSelectedCluster(cluster);
                }}
              />
              <Bar
                dataKey="negative"
                stackId="a"
                fill="#ef4444"
                name="negative"
                onClick={(_data, _index, e) => {
                  void e;
                  const barData = _data as unknown as { id: string };
                  const cluster = clusters.find((c) => c.id === barData.id);
                  if (cluster) setSelectedCluster(cluster);
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* クラスター詳細モーダル */}
      <Dialog open={!!selectedCluster} onOpenChange={(open) => !open && setSelectedCluster(null)}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          {selectedCluster && (
            <>
              <DialogHeader>
                <DialogTitle className="flex flex-wrap items-center gap-2 text-lg">
                  {selectedCluster.label}
                  <Badge variant="secondary" className="text-xs">
                    {CATEGORY_LABELS[selectedCluster.category]}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    重要度: {relevanceLabels[selectedCluster.business_relevance.level]}
                  </Badge>
                </DialogTitle>
                <p className="text-sm text-gray-500">
                  {selectedCluster.post_count} 件の投稿
                </p>
              </DialogHeader>

              {/* 感情分布バー */}
              <div>
                <div className="mb-2 flex h-3 overflow-hidden rounded-full">
                  {totalSentiment > 0 && (
                    <>
                      <div
                        className="bg-green-500"
                        style={{ width: `${(selectedCluster.sentiment_distribution.positive / totalSentiment) * 100}%` }}
                      />
                      <div
                        className="bg-gray-400"
                        style={{ width: `${(selectedCluster.sentiment_distribution.neutral / totalSentiment) * 100}%` }}
                      />
                      <div
                        className="bg-red-500"
                        style={{ width: `${(selectedCluster.sentiment_distribution.negative / totalSentiment) * 100}%` }}
                      />
                    </>
                  )}
                </div>
                <div className="flex gap-4 text-sm">
                  {(["positive", "neutral", "negative"] as const).map((s) => {
                    const count = selectedCluster.sentiment_distribution[s];
                    const c = sentimentConfig[s];
                    return (
                      <span key={s} className={c.color}>
                        {c.label}: {count}件
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* サマリー */}
              <div>
                <h4 className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                  <BarChart3 className="h-4 w-4" />
                  クラスター分析
                </h4>
                <p className="text-sm leading-relaxed text-gray-700">
                  {selectedCluster.summary}
                </p>
              </div>

              {/* アクション提案 */}
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                <div className="flex gap-2">
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">アクション提案</p>
                    <p className="mt-0.5 text-sm text-blue-700">
                      {selectedCluster.business_relevance.actionable_insight}
                    </p>
                  </div>
                </div>
              </div>

              {/* 代表コメント */}
              {displayPosts.length > 0 && (
                <div>
                  <h4 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                    <MessageCircle className="h-4 w-4 text-blue-600" />
                    {representativePosts.length > 0 ? "代表的なコメント" : "所属コメント（一部）"}
                  </h4>
                  <ul className="space-y-2">
                    {displayPosts.map((post) => (
                      <li key={post.id} className="rounded-lg border p-3">
                        <p className="text-sm leading-relaxed text-gray-800">
                          {post.content}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                          <span>{post.author}</span>
                          <span className={sentimentConfig[post.sentiment]?.color}>
                            {sentimentConfig[post.sentiment]?.label}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
