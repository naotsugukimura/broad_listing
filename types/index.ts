// ソフトウェア名（調査対象）
export type SoftwareName =
  | "kabenashi"
  | "honobono"
  | "kaishu"
  | "knoube"
  | "hug"
  | "wiseman"
  | "none";

// ソフトウェア名ラベル
export const SOFTWARE_LABELS: Record<SoftwareName, string> = {
  kabenashi: "かべなしクラウド",
  honobono: "ほのぼの NEXT",
  kaishu: "介舟ファミリー",
  knoube: "ノウビー",
  hug: "HUG",
  wiseman: "ワイズマン",
  none: "未使用",
};

// 評価対象の機能軸
export type FeatureAspect =
  | "billing"
  | "recording"
  | "care_plan"
  | "ui_ux"
  | "support"
  | "pricing"
  | "mobile"
  | "data_migration"
  | "reporting";

// 機能軸ラベル
export const FEATURE_LABELS: Record<FeatureAspect, string> = {
  billing: "請求機能",
  recording: "記録管理",
  care_plan: "支援計画",
  ui_ux: "操作性・UI",
  support: "サポート",
  pricing: "価格",
  mobile: "モバイル",
  data_migration: "データ移行",
  reporting: "帳票・レポート",
};

// Plutchikの感情の輪（8基本感情）- WRIME日本語データセット準拠
export type PlutchikEmotion =
  | "joy"
  | "trust"
  | "anticipation"
  | "surprise"
  | "fear"
  | "sadness"
  | "anger"
  | "disgust";

export const EMOTION_LABELS: Record<PlutchikEmotion, string> = {
  joy: "喜び",
  trust: "信頼",
  anticipation: "期待",
  surprise: "驚き",
  fear: "不安",
  sadness: "悲しみ",
  anger: "怒り",
  disgust: "嫌悪",
};

// 8感情スコア（0-3の強度）
export type EmotionScores = Record<PlutchikEmotion, number>;

// アスペクトベース感情分析（ABSA）— 5段階スコア + CoT
export type AspectSentiment = {
  aspect: FeatureAspect;
  sentiment: "positive" | "neutral" | "negative"; // 後方互換（scoreから導出）
  score?: number; // 1-5 詳細スコア（1=非常に不満 → 5=非常に満足）
  detail: string; // 判定理由（Chain of Thought）
};

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
  // 拡張フィールド
  software_mentioned: SoftwareName[];
  aspect_sentiments: AspectSentiment[];
  emotion_scores: EmotionScores;
  search_tier?: string;
  // v2: 感情分析強化フィールド
  sentiment_score?: number; // 1-5 全体スコア
  sentiment_reason?: string; // 全体判定のCoT理由
  service_types?: ServiceType[]; // 検出されたサービス種別
  key_keywords?: string[]; // 抽出キーワード
};

// 障害福祉サービス種別
export type ServiceType =
  | "b_type"        // 就労継続支援B型
  | "a_type"        // 就労継続支援A型
  | "transition"    // 就労移行支援
  | "after_school"  // 放課後等デイサービス
  | "group_home"    // グループホーム（共同生活援助）
  | "day_care"      // 生活介護
  | "consultation"  // 相談支援（計画相談）
  | "child_dev"     // 児童発達支援
  | "unknown";      // 特定できない

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  b_type: "就労継続B型",
  a_type: "就労継続A型",
  transition: "就労移行支援",
  after_school: "放課後等デイ",
  group_home: "グループホーム",
  day_care: "生活介護",
  consultation: "相談支援",
  child_dev: "児童発達支援",
  unknown: "不明",
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
  // 拡張フィールド
  feature_analysis: FeatureAnalysis[];
};

// 機能別評価集計（クラスター内）
export type FeatureAnalysis = {
  aspect: FeatureAspect;
  positive_count: number;
  negative_count: number;
  summary: string;
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
  feature_analysis: FeatureAnalysis[];
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
