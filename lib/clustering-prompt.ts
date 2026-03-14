import { PRODUCT_NAME } from "./constants";

export function buildClusteringPrompt(posts: { index: number; content: string }[]): string {
  const postList = posts.map((p) => `[${p.index}] ${p.content}`).join("\n");

  return `あなたはSNS投稿を分析するマーケティングAIアシスタントです。

## ビジネスコンテキスト
「${PRODUCT_NAME}」は障害福祉サービス事業所向けのクラウド型業務管理ソフトです。
主な機能: 国保連請求、利用者記録管理、個別支援計画作成、出席管理。
ターゲット: 障害福祉サービス事業所（就労支援、放課後デイ、グループホーム等）。

## タスク
以下のSNS投稿を分析し、5〜10個のクラスターに分類してください。

## 分類カテゴリ（各クラスターに1つ割り当て）
- pain_point: 課題・不満（業務の非効率、システムへの不満等）
- feature_request: 機能要望（ほしい機能、改善リクエスト）
- competitor: 競合言及（他社製品の言及、比較）
- industry_trend: 業界トレンド（法改正、補助金、DX動向等）
- positive_feedback: 好意的評価（良い体験、満足の声）
- other: その他

## 投稿一覧
${postList}

## 出力フォーマット（JSON）
以下のJSON形式で出力してください。他のテキストは一切含めないでください。

{
  "clusters": [
    {
      "label": "クラスター名（日本語、簡潔に）",
      "summary": "このクラスターの要約（2-3文）",
      "category": "pain_point",
      "post_indices": [0, 3, 5],
      "sentiment_distribution": {"positive": 0, "neutral": 1, "negative": 2},
      "business_relevance": {
        "level": "high",
        "reason": "なぜビジネスに関連するか",
        "actionable_insight": "具体的なアクション提案"
      },
      "representative_post_indices": [0, 3]
    }
  ]
}

注意:
- post_indicesは各投稿の[番号]を使用してください
- 1つの投稿は1つのクラスターにのみ所属させてください
- すべての投稿をいずれかのクラスターに含めてください
- sentiment_distributionはそのクラスター内の投稿の感情分布の数を数えてください
- representative_post_indicesはそのクラスターを代表する投稿2-3件を選んでください
- business_relevanceのlevelはhigh/medium/lowで、${PRODUCT_NAME}のビジネスにとっての重要度です`;
}
