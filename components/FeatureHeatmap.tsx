"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export function FeatureHeatmap({ posts }: Props) {
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
    return `良: ${cell.positive} / 中: ${cell.neutral} / 悪: ${cell.negative}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">機能 × ソフトウェア 評価マトリクス</CardTitle>
        <p className="text-xs text-gray-500">
          各ソフトウェアの機能別評価（緑=好評、赤=不評、黄=混在）
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
                  return (
                    <td
                      key={`${sw}:${feat}`}
                      className={`border p-2 text-center font-medium ${getCellColor(cell)}`}
                      title={getCellTooltip(cell)}
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
  );
}
