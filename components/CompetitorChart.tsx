"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { SOFTWARE_LABELS } from "@/types";
import type { SnsPost, SoftwareName } from "@/types";

type Props = {
  posts: SnsPost[];
};

export function CompetitorChart({ posts }: Props) {
  // ソフトウェアごとの感情分布を集計
  const softwareStats = new Map<
    SoftwareName,
    { positive: number; neutral: number; negative: number; total: number }
  >();

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

  // データ整形（投稿数の多い順）
  const chartData = Array.from(softwareStats.entries())
    .sort((a, b) => b[1].total - a[1].total)
    .map(([key, stat]) => ({
      name: SOFTWARE_LABELS[key] ?? key,
      ポジティブ: stat.positive,
      中立: stat.neutral,
      ネガティブ: stat.negative,
    }));

  if (chartData.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">ソフトウェア別 感情分布</CardTitle>
        <p className="text-xs text-gray-500">
          各ソフトウェアに言及した投稿の感情分析結果
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical">
            <XAxis type="number" domain={[0, "auto"]} allowDecimals={false} />
            <YAxis
              type="category"
              dataKey="name"
              width={120}
              tick={{ fontSize: 12 }}
            />
            <Tooltip />
            <Legend />
            <Bar dataKey="ポジティブ" stackId="a" fill="#22c55e" />
            <Bar dataKey="中立" stackId="a" fill="#9ca3af" />
            <Bar dataKey="ネガティブ" stackId="a" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
