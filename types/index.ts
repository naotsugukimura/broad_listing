// SNS投稿
export type SnsPost = {
  id: string;
  content: string;
  author: string;
  source: "x" | "dummy";
  posted_at: string;
  sentiment: "positive" | "neutral" | "negative";
  cluster_id: string | null;
  created_at: string;
};

// クラスター
export type PostCluster = {
  id: string;
  run_id: string;
  label: string;
  summary: string;
  category: ClusterCategory;
  post_count: number;
  sentiment_distribution: SentimentDistribution;
  business_relevance: BusinessRelevance;
  representative_posts: string[];
  created_at: string;
};

// クラスタリング実行
export type ClusteringRun = {
  id: string;
  status: "pending" | "processing" | "completed" | "failed";
  total_posts: number;
  cluster_count: number;
  created_at: string;
  completed_at: string | null;
};

// クラスターカテゴリ
export type ClusterCategory =
  | "pain_point"
  | "feature_request"
  | "competitor"
  | "industry_trend"
  | "positive_feedback"
  | "other";

// 感情分布
export type SentimentDistribution = {
  positive: number;
  neutral: number;
  negative: number;
};

// ビジネス関連性
export type BusinessRelevance = {
  level: "high" | "medium" | "low";
  reason: string;
  actionable_insight: string;
};

// Geminiクラスタリングレスポンス
export type GeminiClusterResponse = {
  clusters: GeminiCluster[];
};

export type GeminiCluster = {
  label: string;
  summary: string;
  category: ClusterCategory;
  post_indices: number[];
  sentiment_distribution: SentimentDistribution;
  business_relevance: BusinessRelevance;
  representative_post_indices: number[];
};

// カテゴリラベルマッピング
export const CATEGORY_LABELS: Record<ClusterCategory, string> = {
  pain_point: "課題・不満",
  feature_request: "機能要望",
  competitor: "競合言及",
  industry_trend: "業界トレンド",
  positive_feedback: "好意的評価",
  other: "その他",
};

// 感情ラベル
export const SENTIMENT_LABELS: Record<string, string> = {
  positive: "ポジティブ",
  neutral: "中立",
  negative: "ネガティブ",
};
