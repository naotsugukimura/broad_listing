"use client";

import { useState, useCallback } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Map } from "lucide-react";

type VectorMapPoint = {
  id: string;
  content: string;
  author: string;
  sentiment: string;
  cluster_id: string | null;
  cluster_label: string | null;
  umap_x: number;
  umap_y: number;
};

// クラスターごとの色パレット（安野氏スライドに近い配色）
const CLUSTER_COLORS = [
  "#8b5cf6", // 紫
  "#ef4444", // 赤
  "#22c55e", // 緑
  "#f59e0b", // 黄
  "#3b82f6", // 青
  "#ec4899", // ピンク
  "#14b8a6", // ティール
  "#f97316", // オレンジ
  "#6366f1", // インディゴ
  "#84cc16", // ライム
  "#06b6d4", // シアン
  "#a855f7", // 明紫
];

const UNASSIGNED_COLOR = "#9ca3af";

type Props = {
  onGenerate?: () => void;
};

export function VectorMap({ onGenerate }: Props) {
  const [points, setPoints] = useState<VectorMapPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<VectorMapPoint | null>(null);

  const fetchExisting = useCallback(async () => {
    const res = await fetch("/api/vectormap");
    const data = await res.json();
    if (data.points && data.points.length > 0) {
      setPoints(data.points);
    }
  }, []);

  const generateMap = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/vectormap", { method: "POST" });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setPoints(data.points || []);
        onGenerate?.();
      }
    } catch {
      setError("ベクトルマップ生成に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  // 初回ロード
  useState(() => {
    fetchExisting();
  });

  // クラスターIDごとの色マッピング
  const clusterIds = [...new Set(points.filter((p) => p.cluster_id).map((p) => p.cluster_id))];
  const colorMap: Record<string, string> = {};
  clusterIds.forEach((id, i) => {
    if (id) colorMap[id] = CLUSTER_COLORS[i % CLUSTER_COLORS.length];
  });

  const getColor = (point: VectorMapPoint) => {
    if (!point.cluster_id) return UNASSIGNED_COLOR;
    return colorMap[point.cluster_id] || UNASSIGNED_COLOR;
  };

  // 凡例用クラスターリスト
  const legendItems = clusterIds
    .filter((id): id is string => id !== null)
    .map((id) => ({
      id,
      label: points.find((p) => p.cluster_id === id)?.cluster_label || "不明",
      color: colorMap[id] || UNASSIGNED_COLOR,
      count: points.filter((p) => p.cluster_id === id).length,
    }));

  const unassignedCount = points.filter((p) => !p.cluster_id).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
            ベクトルマップ（意見の分布可視化）
          </CardTitle>
          <Button onClick={generateMap} disabled={loading} size="sm">
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Map className="mr-2 h-4 w-4" />
            )}
            {points.length > 0 ? "再生成" : "マップ生成"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <p className="mb-3 text-sm text-red-600">{error}</p>
        )}

        {points.length === 0 && !loading && (
          <div className="flex h-80 items-center justify-center rounded-lg border border-dashed text-gray-500">
            <p>
              データ収集・クラスタリング後に「マップ生成」をクリックしてください
            </p>
          </div>
        )}

        {points.length > 0 && (
          <>
            <ResponsiveContainer width="100%" height={500}>
              <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <XAxis
                  dataKey="umap_x"
                  type="number"
                  tick={false}
                  axisLine={false}
                  name="X"
                />
                <YAxis
                  dataKey="umap_y"
                  type="number"
                  tick={false}
                  axisLine={false}
                  name="Y"
                />
                <Tooltip
                  content={({ payload }) => {
                    if (!payload || payload.length === 0) return null;
                    const point = payload[0].payload as VectorMapPoint;
                    return (
                      <div className="max-w-xs rounded-lg border bg-white p-3 shadow-lg">
                        <p className="mb-1 text-sm font-semibold">
                          {point.cluster_label || "未分類"}
                        </p>
                        <p className="mb-1 text-xs text-gray-600 line-clamp-3">
                          {point.content}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{point.author}</span>
                          <span
                            className={
                              point.sentiment === "positive"
                                ? "text-green-600"
                                : point.sentiment === "negative"
                                  ? "text-red-600"
                                  : "text-gray-500"
                            }
                          >
                            {point.sentiment === "positive"
                              ? "Positive"
                              : point.sentiment === "negative"
                                ? "Negative"
                                : "Neutral"}
                          </span>
                        </div>
                      </div>
                    );
                  }}
                />
                <Scatter data={points} fill="#8884d8">
                  {points.map((point, index) => (
                    <Cell
                      key={point.id}
                      fill={getColor(point)}
                      opacity={
                        hoveredPoint
                          ? hoveredPoint.cluster_id === point.cluster_id
                            ? 1
                            : 0.2
                          : 0.8
                      }
                      r={6}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>

            {/* 凡例 */}
            <div className="mt-4 flex flex-wrap gap-3">
              {legendItems.map((item) => (
                <button
                  key={item.id}
                  className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors hover:bg-gray-50"
                  onMouseEnter={() =>
                    setHoveredPoint(
                      points.find((p) => p.cluster_id === item.id) || null
                    )
                  }
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.label}</span>
                  <span className="text-gray-400">({item.count})</span>
                </button>
              ))}
              {unassignedCount > 0 && (
                <span className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs text-gray-500">
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ backgroundColor: UNASSIGNED_COLOR }}
                  />
                  未分類 ({unassignedCount})
                </span>
              )}
            </div>

            <p className="mt-2 text-xs text-gray-400">
              各ドットは1つの投稿を表します。AIが文章の意味を読み取り、似た内容の投稿ほど近くに配置しています。色はクラスター分類に対応。軸の数値に意味はありません（高次元データを2Dに圧縮した座標です）。
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
