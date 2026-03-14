"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ExternalLink, MessageCircle } from "lucide-react";
import { SOFTWARE_LABELS } from "@/types";
import type { SnsPost, SoftwareName } from "@/types";

type Props = {
  posts: SnsPost[];
};

// 表示順序: 自社 → 競合（アルファベット順）
const DISPLAY_ORDER: SoftwareName[] = [
  "kabenashi",
  "honobono",
  "kaishu",
  "knoube",
  "hug",
  "wiseman",
  "none",
];

const sentimentConfig: Record<string, { label: string; color: string }> = {
  positive: { label: "ポジティブ", color: "text-green-600" },
  neutral: { label: "中立", color: "text-gray-500" },
  negative: { label: "ネガティブ", color: "text-red-600" },
};

export function CompetitorChart({ posts }: Props) {
  const [selectedSoftware, setSelectedSoftware] = useState<SoftwareName | null>(null);

  // 全ソフトを初期値0で初期化
  const softwareStats = new Map<
    SoftwareName,
    { positive: number; neutral: number; negative: number; total: number }
  >();
  for (const sw of DISPLAY_ORDER) {
    softwareStats.set(sw, { positive: 0, neutral: 0, negative: 0, total: 0 });
  }

  // 投稿データから集計
  for (const post of posts) {
    const mentioned = post.software_mentioned ?? [];
    if (mentioned.length === 0) continue;

    for (const sw of mentioned) {
      const key = sw as SoftwareName;
      if (!softwareStats.has(key)) {
        softwareStats.set(key, { positive: 0, neutral: 0, negative: 0, total: 0 });
      }
      const stat = softwareStats.get(key)!;
      stat[post.sentiment]++;
      stat.total++;
    }
  }

  // 表示順序に従ってデータ整形（softwareKeyを保持）
  const chartData = DISPLAY_ORDER.map((key) => {
    const stat = softwareStats.get(key)!;
    return {
      softwareKey: key,
      name: SOFTWARE_LABELS[key] ?? key,
      ポジティブ: stat.positive,
      中立: stat.neutral,
      ネガティブ: stat.negative,
      total: stat.total,
    };
  });

  // モーダル用: 選択ソフトに言及している投稿をフィルタ
  const filteredPosts = selectedSoftware
    ? posts.filter((p) => (p.software_mentioned ?? []).includes(selectedSoftware))
    : [];

  const selectedStats = selectedSoftware
    ? softwareStats.get(selectedSoftware)
    : null;

  // バークリック時のハンドラ
  const handleBarClick = (data: Record<string, unknown>) => {
    const sw = data.softwareKey as SoftwareName | undefined;
    if (sw) setSelectedSoftware(sw);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">ソフトウェア別 感情分布</CardTitle>
          <p className="text-xs text-gray-500">
            棒グラフをクリックすると、該当ソフトウェアの投稿一覧を確認できます
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={chartData}
              layout="vertical"
              style={{ cursor: "pointer" }}
            >
              <XAxis type="number" domain={[0, "auto"]} allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="name"
                width={140}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value, name) => [value, name]}
                labelFormatter={(label) => {
                  const item = chartData.find((d) => d.name === label);
                  return item ? `${label}（計${item.total}件）` : label;
                }}
              />
              <Legend />
              <Bar
                dataKey="ポジティブ"
                stackId="a"
                fill="#22c55e"
                onClick={handleBarClick}
              />
              <Bar
                dataKey="中立"
                stackId="a"
                fill="#9ca3af"
                onClick={handleBarClick}
              />
              <Bar
                dataKey="ネガティブ"
                stackId="a"
                fill="#ef4444"
                onClick={handleBarClick}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ソフトウェア別 投稿一覧モーダル */}
      <Dialog open={!!selectedSoftware} onOpenChange={(open) => !open && setSelectedSoftware(null)}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          {selectedSoftware && selectedStats && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg">
                  {SOFTWARE_LABELS[selectedSoftware]}
                  <Badge variant="outline" className="text-xs">
                    計 {selectedStats.total} 件
                  </Badge>
                </DialogTitle>
              </DialogHeader>

              {/* 感情分布バー */}
              {selectedStats.total > 0 && (
                <div>
                  <div className="mb-2 flex h-3 overflow-hidden rounded-full">
                    <div
                      className="bg-green-500"
                      style={{ width: `${(selectedStats.positive / selectedStats.total) * 100}%` }}
                    />
                    <div
                      className="bg-gray-400"
                      style={{ width: `${(selectedStats.neutral / selectedStats.total) * 100}%` }}
                    />
                    <div
                      className="bg-red-500"
                      style={{ width: `${(selectedStats.negative / selectedStats.total) * 100}%` }}
                    />
                  </div>
                  <div className="flex gap-4 text-sm">
                    {(["positive", "neutral", "negative"] as const).map((s) => {
                      const count = selectedStats[s];
                      const c = sentimentConfig[s];
                      return (
                        <span key={s} className={c.color}>
                          {c.label}: {count}件
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 投稿一覧 */}
              {filteredPosts.length > 0 ? (
                <div>
                  <h4 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                    <MessageCircle className="h-4 w-4 text-blue-600" />
                    該当する投稿
                  </h4>
                  <ul className="space-y-2">
                    {filteredPosts.map((post) => (
                      <li key={post.id} className="rounded-lg border p-3">
                        <p className="text-sm leading-relaxed text-gray-800">
                          {post.content}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                          {post.tweet_url ? (
                            <a
                              href={post.tweet_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-blue-600 hover:underline"
                            >
                              {post.author}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            <span>{post.author}</span>
                          )}
                          <span className={sentimentConfig[post.sentiment]?.color}>
                            {sentimentConfig[post.sentiment]?.label}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-gray-500">該当する投稿がありません。</p>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
