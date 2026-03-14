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

export function CompetitorChart({ posts }: Props) {
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

  // 表示順序に従ってデータ整形
  const chartData = DISPLAY_ORDER
    .map((key) => {
      const stat = softwareStats.get(key)!;
      return {
        name: SOFTWARE_LABELS[key] ?? key,
        ポジティブ: stat.positive,
        中立: stat.neutral,
        ネガティブ: stat.negative,
        total: stat.total,
      };
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">ソフトウェア別 感情分布</CardTitle>
        <p className="text-xs text-gray-500">
          各ソフトウェアに言及した投稿の感情分析結果（言及なし = データ不足）
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} layout="vertical">
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
            <Bar dataKey="ポジティブ" stackId="a" fill="#22c55e" />
            <Bar dataKey="中立" stackId="a" fill="#9ca3af" />
            <Bar dataKey="ネガティブ" stackId="a" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
