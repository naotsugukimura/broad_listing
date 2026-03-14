// 検索キーワード（X API統合時に使用）
export const SEARCH_KEYWORDS = [
  "福祉 ソフト",
  "介護 請求",
  "国保連 請求",
  "福祉 DX",
  "かべなしクラウド",
  "ほのぼの NEXT",
  "介舟ファミリー",
  "ノウビー Knoube",
  "HUG ネットアーツ",
  "ワイズマン 福祉",
  "障害福祉 記録",
  "放課後デイ システム",
  "就労支援 業務",
  "福祉 IT化",
  "返戻 請求ミス",
];

// 製品名
export const PRODUCT_NAME = "かべなしクラウド";

// 競合ソフト情報
export const COMPETITOR_SOFTWARE = {
  kabenashi: {
    name: "かべなしクラウド",
    vendor: "—",
    features: "クラウド型・低価格・障害福祉特化・国保連請求・利用者記録管理",
  },
  honobono: {
    name: "ほのぼの NEXT",
    vendor: "NDソフトウェア",
    features: "業界最大手・多機能・介護＆障害福祉・高価格帯",
  },
  kaishu: {
    name: "介舟ファミリー",
    vendor: "インフォコム",
    features: "老舗・介護＆障害福祉対応・安定性重視",
  },
  knoube: {
    name: "ノウビー (Knoube)",
    vendor: "カナミックネットワーク",
    features: "クラウド型・医療連携に強い・多職種連携",
  },
  hug: {
    name: "HUG",
    vendor: "ネットアーツ",
    features: "放課後デイ・障害福祉特化・専門性高い",
  },
  wiseman: {
    name: "ワイズマン",
    vendor: "ワイズマン",
    features: "介護・福祉大手・長い実績・UIが古い",
  },
} as const;

// 評価対象の機能カテゴリ
export const EVALUATION_FEATURES = [
  "billing",
  "recording",
  "care_plan",
  "ui_ux",
  "support",
  "pricing",
  "mobile",
  "data_migration",
  "reporting",
] as const;

// X API設定
export const X_MAX_RESULTS_PER_QUERY = 10;

// 収集ソースラベル
export const SOURCE_LABELS: Record<string, string> = {
  x: "X (Twitter)",
  dummy: "ダミーデータ",
};
