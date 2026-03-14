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
import { ExternalLink, MessageCircle } from "lucide-react";
import { FEATURE_LABELS, SOFTWARE_LABELS } from "@/types";
import type { SnsPost, SoftwareName, FeatureAspect, AspectSentiment } from "@/types";

type Props = {
  posts: SnsPost[];
};

type CellData = {
  positive: number;
  negative: number;
  neutral: number;
};

type SelectedCell = {
  software: SoftwareName;
  feature: FeatureAspect;
};

const sentimentConfig: Record<string, { label: string; color: string }> = {
  positive: { label: "ポジティブ", color: "text-green-600" },
  neutral: { label: "中立", color: "text-gray-500" },
  negative: { label: "ネガティブ", color: "text-red-600" },
};

const scoreBadge = (score: number) => {
  if (score >= 4) return { variant: "default" as const, className: "bg-green-600" };
  if (score <= 2) return { variant: "default" as const, className: "bg-red-600" };
  return { variant: "secondary" as const, className: "" };
};

export function FeatureHeatmap({ posts }: Props) {
  const [selectedCell, setSelectedCell] = useState<SelectedCell | null>(null);

  // ソフトウェア × 機能 のマトリクスを構築
  const matrix = new Map<string, CellData>();
  const softwareSet = new Set<SoftwareName>();
  const featureSet = new Set<FeatureAspect>();

  for (const post of posts) {
    const mentioned = (post.software_mentioned ?? []) as SoftwareName[];
    const aspects = (post.aspect_sentiments ?? []) as AspectSentiment[];

    if (mentioned.length === 0 || aspects.length === 0) continue;

    for (const sw of mentioned) {
      softwareSet.add(sw);
      for (const asp of aspects) {
        featureSet.add(asp.aspect);
        const key = `${sw}:${asp.aspect}`;
        if (!matrix.has(key)) {
          matrix.set(key, { positive: 0, negative: 0, neutral: 0 });
        }
        const cell = matrix.get(key)!;
        cell[asp.sentiment]++;
      }
    }
  }

  const softwareList = Array.from(softwareSet);
  const featureList = Array.from(featureSet);

  // モーダル用: 選択セルに該当する投稿をフィルタ
  const filteredPosts = selectedCell
    ? posts.filter((p) => {
        const mentioned = (p.software_mentioned ?? []) as SoftwareName[];
        const aspects = (p.aspect_sentiments ?? []) as AspectSentiment[];
        return (
          mentioned.includes(selectedCell.software) &&
          aspects.some((a) => a.aspect === selectedCell.feature)
        );
      })
    : [];

  const selectedCellData = selectedCell
    ? matrix.get(`${selectedCell.software}:${selectedCell.feature}`)
    : null;

  if (softwareList.length === 0 || featureList.length === 0) {
    return null;
  }

  const getCellColor = (cell: CellData | undefined): string => {
    if (!cell) return "bg-gray-50";
    const total = cell.positive + cell.negative + cell.neutral;
    if (total === 0) return "bg-gray-50";

    const score = (cell.positive - cell.negative) / total;
    if (score > 0.3) return "bg-green-100 text-green-800";
    if (score < -0.3) return "bg-red-100 text-red-800";
    return "bg-yellow-50 text-yellow-800";
  };

  const getCellLabel = (cell: CellData | undefined): string => {
    if (!cell) return "—";
    const total = cell.positive + cell.negative + cell.neutral;
    if (total === 0) return "—";
    if (cell.positive > cell.negative) return `+${cell.positive}`;
    if (cell.negative > cell.positive) return `-${cell.negative}`;
    return `${total}`;
  };

  const getCellTooltip = (cell: CellData | undefined): string => {
    if (!cell) return "データなし";
    return `良: ${cell.positive} / 中: ${cell.neutral} / 悪: ${cell.negative}（クリックで投稿を確認）`;
  };

  const isCellClickable = (cell: CellData | undefined): boolean => {
    if (!cell) return false;
    return cell.positive + cell.negative + cell.neutral > 0;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">機能 × ソフトウェア 評価マトリクス</CardTitle>
          <p className="text-xs text-gray-500">
            セルをクリックすると、該当する投稿一覧を確認できます
          </p>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className="border p-2 text-left bg-gray-100">機能＼ソフト</th>
                {softwareList.map((sw) => (
                  <th key={sw} className="border p-2 text-center bg-gray-100 min-w-[80px]">
                    {SOFTWARE_LABELS[sw]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {featureList.map((feat) => (
                <tr key={feat}>
                  <td className="border p-2 font-medium bg-gray-50">
                    {FEATURE_LABELS[feat]}
                  </td>
                  {softwareList.map((sw) => {
                    const cell = matrix.get(`${sw}:${feat}`);
                    const clickable = isCellClickable(cell);
                    return (
                      <td
                        key={`${sw}:${feat}`}
                        className={`border p-2 text-center font-medium ${getCellColor(cell)} ${
                          clickable
                            ? "cursor-pointer hover:ring-2 hover:ring-blue-400 hover:ring-inset transition-shadow"
                            : ""
                        }`}
                        title={getCellTooltip(cell)}
                        onClick={() => {
                          if (clickable) {
                            setSelectedCell({ software: sw, feature: feat });
                          }
                        }}
                      >
                        {getCellLabel(cell)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* ソフトウェア × 機能 投稿一覧モーダル */}
      <Dialog open={!!selectedCell} onOpenChange={(open) => !open && setSelectedCell(null)}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          {selectedCell && (
            <>
              <DialogHeader>
                <DialogTitle className="flex flex-wrap items-center gap-2 text-lg">
                  {SOFTWARE_LABELS[selectedCell.software]}
                  <span className="text-gray-400">×</span>
                  {FEATURE_LABELS[selectedCell.feature]}
                  <Badge variant="outline" className="text-xs">
                    {filteredPosts.length} 件
                  </Badge>
                </DialogTitle>
              </DialogHeader>

              {/* 感情分布 */}
              {selectedCellData && (
                <div>
                  <div className="mb-2 flex h-3 overflow-hidden rounded-full">
                    {(() => {
                      const total =
                        selectedCellData.positive +
                        selectedCellData.neutral +
                        selectedCellData.negative;
                      if (total === 0) return null;
                      return (
                        <>
                          <div
                            className="bg-green-500"
                            style={{ width: `${(selectedCellData.positive / total) * 100}%` }}
                          />
                          <div
                            className="bg-gray-400"
                            style={{ width: `${(selectedCellData.neutral / total) * 100}%` }}
                          />
                          <div
                            className="bg-red-500"
                            style={{ width: `${(selectedCellData.negative / total) * 100}%` }}
                          />
                        </>
                      );
                    })()}
                  </div>
                  <div className="flex gap-4 text-sm">
                    {(["positive", "neutral", "negative"] as const).map((s) => {
                      const count = selectedCellData[s];
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
                    {filteredPosts.map((post) => {
                      const matchedAspect = (post.aspect_sentiments ?? []).find(
                        (a) => a.aspect === selectedCell.feature
                      );
                      return (
                        <li key={post.id} className="rounded-lg border p-3">
                          <p className="text-sm leading-relaxed text-gray-800">
                            {post.content}
                          </p>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-400">
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
                            {matchedAspect && (
                              <Badge
                                variant={scoreBadge(matchedAspect.score).variant}
                                className={`text-[10px] ${scoreBadge(matchedAspect.score).className}`}
                              >
                                {FEATURE_LABELS[selectedCell.feature]}: {matchedAspect.score}/5
                              </Badge>
                            )}
                          </div>
                          {matchedAspect?.detail && (
                            <p className="mt-1 text-xs text-gray-500 italic">
                              {matchedAspect.detail}
                            </p>
                          )}
                        </li>
                      );
                    })}
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
