// ─────────────────────────────────────
// X検索キーワード戦略（障害福祉特化）
// ─────────────────────────────────────
// かべなしクラウドは就労継続B型でPMF済み。
// 他サービス種（放デイ・就労移行・GH等）は開拓フェーズ。
// 介護（高齢者介護）のノイズを排除し、障害福祉に絞り込む。
//
// 検索方式:
//   andKeywords  → (word1 word2) — AND検索（両方含むツイートをヒット）
//   exactPhrases → "phrase"     — 完全一致（ブランド名等）

export type SearchTier = {
  label: string;
  priority: number;
  maxResults: number;
  andKeywords: string[];
  exactPhrases: string[];
};

export const SEARCH_TIERS: Record<string, SearchTier> = {
  // ── Tier 1: 就労継続B型（PMF済 — 最重点）──
  // かべなしクラウドの主力市場。ユーザーの生の声を最優先で収集。
  pmf_b_type: {
    label: "就労継続B型（PMF済）",
    priority: 1,
    maxResults: 30,
    andKeywords: [
      "就労継続B型 ソフト",
      "就労B型 請求",
      "就労B型 記録",
      "就労継続B型 システム",
      "工賃管理 システム",
    ],
    exactPhrases: [],
  },

  // ── Tier 2: 自社＋競合ブランド ──
  // 障害福祉特化ブランドはそのまま、介護兼業ブランドは「障害」で絞る。
  brands: {
    label: "自社＋競合ブランド",
    priority: 2,
    maxResults: 25,
    andKeywords: [
      "ほのぼの 障害福祉",
      "介舟ファミリー 障害",
      "ノウビー 障害",
      "ワイズマン 障害福祉",
    ],
    exactPhrases: [
      "かべなしクラウド",
      "HUG ネットアーツ",
    ],
  },

  // ── Tier 3: 次期PMF重点3サービス ──
  // 直近で重点的にPMFを進める3サービス種。
  // 相談支援・グループホーム・生活介護の市場の声を厚く収集。
  next_pmf: {
    label: "次期PMF重点（相談支援・GH・生活介護）",
    priority: 3,
    maxResults: 30,
    andKeywords: [
      // 相談支援（計画相談支援）
      "相談支援 ソフト",
      "計画相談 システム",
      "計画相談 請求",
      "サービス等利用計画 作成",
      // グループホーム（共同生活援助）
      "グループホーム ソフト",
      "グループホーム 請求",
      "グループホーム 記録",
      "共同生活援助 システム",
      // 生活介護
      "生活介護 ソフト",
      "生活介護 請求",
      "生活介護 記録",
    ],
    exactPhrases: [],
  },

  // ── Tier 4: 障害福祉 × ソフト/DX ──
  // 障害福祉分野でのソフト・DX需要を広く捕捉。
  disability_dx: {
    label: "障害福祉×ソフト・DX",
    priority: 4,
    maxResults: 20,
    andKeywords: [
      "障害福祉 ソフト",
      "障害福祉 システム",
      "障害福祉 DX",
      "障害福祉 IT化",
    ],
    exactPhrases: [],
  },

  // ── Tier 5: 業務課題・ペインポイント ──
  // 障害福祉事業所の日常的な業務課題を捕捉。
  // 「実績記録票」「個別支援計画」は障害福祉特有の用語。
  pain_points: {
    label: "業務課題・ペインポイント",
    priority: 5,
    maxResults: 25,
    andKeywords: [
      "国保連 返戻",
      "障害福祉 請求ミス",
      "個別支援計画 作成",
      "サビ管 業務",
      "処遇改善加算 計算",
    ],
    exactPhrases: [
      "実績記録票",
    ],
  },

  // ── Tier 6: 他サービス種（開拓フェーズ）──
  // 上記以外のサービス種。市場の声を広く拾い、参入判断の材料に。
  other_services: {
    label: "他サービス種（開拓中）",
    priority: 6,
    maxResults: 20,
    andKeywords: [
      "放課後デイ ソフト",
      "就労移行 システム",
      "就労A型 請求",
      "児童発達支援 システム",
    ],
    exactPhrases: [],
  },
};

// 後方互換: フラット化したキーワード一覧
export const SEARCH_KEYWORDS = Object.values(SEARCH_TIERS).flatMap(
  (tier) => [...tier.andKeywords, ...tier.exactPhrases]
);

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
