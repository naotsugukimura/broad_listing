"use client";

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
import type { PostCluster } from "@/types";

type Props = {
  clusters: PostCluster[];
};

export function ClusterChart({ clusters }: Props) {
  const data = clusters.map((c) => ({
    name: c.label.length > 10 ? c.label.slice(0, 10) + "..." : c.label,
    fullName: c.label,
    positive: c.sentiment_distribution.positive,
    neutral: c.sentiment_distribution.neutral,
    negative: c.sentiment_distribution.negative,
    total: c.post_count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">クラスター別 投稿数・感情分布</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
            <Bar dataKey="positive" stackId="a" fill="#22c55e" name="positive" />
            <Bar dataKey="neutral" stackId="a" fill="#9ca3af" name="neutral" />
            <Bar dataKey="negative" stackId="a" fill="#ef4444" name="negative" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
