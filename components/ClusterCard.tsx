"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SentimentIndicator } from "./SentimentIndicator";
import { CATEGORY_LABELS } from "@/types";
import type { PostCluster } from "@/types";

type Props = {
  cluster: PostCluster;
};

const relevanceColors: Record<string, string> = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  low: "bg-gray-100 text-gray-600 border-gray-200",
};

const relevanceLabels: Record<string, string> = {
  high: "重要度: 高",
  medium: "重要度: 中",
  low: "重要度: 低",
};

export function ClusterCard({ cluster }: Props) {
  const totalSentiment =
    cluster.sentiment_distribution.positive +
    cluster.sentiment_distribution.neutral +
    cluster.sentiment_distribution.negative;

  const dominantSentiment =
    cluster.sentiment_distribution.negative >= cluster.sentiment_distribution.positive &&
    cluster.sentiment_distribution.negative >= cluster.sentiment_distribution.neutral
      ? "negative"
      : cluster.sentiment_distribution.positive >= cluster.sentiment_distribution.neutral
        ? "positive"
        : "neutral";

  return (
    <Link href={`/clusters/${cluster.id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base leading-tight">
              {cluster.label}
            </CardTitle>
            <Badge variant="outline" className="shrink-0 text-xs">
              {cluster.post_count}件
            </Badge>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="secondary" className="text-xs">
              {CATEGORY_LABELS[cluster.category]}
            </Badge>
            <Badge
              variant="outline"
              className={relevanceColors[cluster.business_relevance.level]}
            >
              {relevanceLabels[cluster.business_relevance.level]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600 line-clamp-2">{cluster.summary}</p>

          {/* 感情分布バー */}
          <div className="space-y-1">
            <div className="flex h-2 overflow-hidden rounded-full">
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
            <div className="flex items-center justify-between text-xs text-gray-500">
              <SentimentIndicator sentiment={dominantSentiment} size="sm" />
              <span>
                +{cluster.sentiment_distribution.positive} / ={cluster.sentiment_distribution.neutral} / -{cluster.sentiment_distribution.negative}
              </span>
            </div>
          </div>

          {/* アクション提案 */}
          <p className="rounded bg-blue-50 p-2 text-xs text-blue-700">
            {cluster.business_relevance.actionable_insight}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
