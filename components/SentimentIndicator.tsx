"use client";

import { cn } from "@/lib/utils";

type Props = {
  sentiment: "positive" | "neutral" | "negative";
  showLabel?: boolean;
  size?: "sm" | "md";
};

const config = {
  positive: {
    label: "ポジティブ",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  neutral: {
    label: "中立",
    color: "text-gray-600",
    bgColor: "bg-gray-100",
  },
  negative: {
    label: "ネガティブ",
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
};

// 形状+色で感情を表現（色のみで区別しない - デジタル庁ガイドライン準拠）
function SentimentShape({
  sentiment,
  size,
}: {
  sentiment: Props["sentiment"];
  size: Props["size"];
}) {
  const s = size === "sm" ? 12 : 16;

  if (sentiment === "positive") {
    // 上向き三角形（ポジティブ）
    return (
      <svg width={s} height={s} viewBox="0 0 16 16" aria-hidden="true">
        <polygon points="8,2 14,14 2,14" fill="currentColor" />
      </svg>
    );
  }

  if (sentiment === "neutral") {
    // 丸（中立）
    return (
      <svg width={s} height={s} viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="8" r="6" fill="currentColor" />
      </svg>
    );
  }

  // 下向き三角形（ネガティブ）
  return (
    <svg width={s} height={s} viewBox="0 0 16 16" aria-hidden="true">
      <polygon points="2,2 14,2 8,14" fill="currentColor" />
    </svg>
  );
}

export function SentimentIndicator({
  sentiment,
  showLabel = true,
  size = "md",
}: Props) {
  const c = config[sentiment];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5",
        c.bgColor,
        c.color,
        size === "sm" && "text-xs",
        size === "md" && "text-sm"
      )}
    >
      <SentimentShape sentiment={sentiment} size={size} />
      {showLabel && <span>{c.label}</span>}
    </span>
  );
}
