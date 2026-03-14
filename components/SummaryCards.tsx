"use client";

import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Layers, TrendingUp, AlertTriangle } from "lucide-react";
import type { PostCluster, SnsPost } from "@/types";

type Props = {
  posts: SnsPost[];
  clusters: PostCluster[];
};

export function SummaryCards({ posts, clusters }: Props) {
  const totalPosts = posts.length;
  const clusterCount = clusters.length;

  const sentimentCounts = posts.reduce(
    (acc, p) => {
      acc[p.sentiment]++;
      return acc;
    },
    { positive: 0, neutral: 0, negative: 0 }
  );

  const highRelevanceCount = clusters.filter(
    (c) => c.business_relevance.level === "high"
  ).length;

  const items = [
    {
      label: "収集投稿数",
      value: totalPosts,
      icon: MessageSquare,
      color: "text-blue-600",
    },
    {
      label: "クラスター数",
      value: clusterCount,
      icon: Layers,
      color: "text-purple-600",
    },
    {
      label: "ポジティブ率",
      value:
        totalPosts > 0
          ? `${Math.round((sentimentCounts.positive / totalPosts) * 100)}%`
          : "0%",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      label: "重要度「高」",
      value: highRelevanceCount,
      icon: AlertTriangle,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label}>
          <CardContent className="flex items-center gap-3 p-4">
            <item.icon className={cn("h-8 w-8 shrink-0", item.color)} />
            <div>
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="text-2xl font-bold">{item.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
