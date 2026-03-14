import { PRODUCT_NAME } from "./constants";

export function buildClusteringPrompt(posts: { index: number; content: string }[]): string {
  const postList = posts.map((p) => `[${p.index}] ${p.content}`).join("\n");

  return `あなたはSNS投稿を分析するマーケティングAIアシスタントです。

## ビジネスコンテキスト
「${PRODUCT_NAME}」は障害福祉サービス事業所向けのクラウド型業務管理ソフトです。
主な機能: 国保連請求、利用者記録管理、個別支援計画作成、出席管理。
ターゲット: 障害福祉サービス事業所（就労支援、放課後デイ、グループホーム等）。

## 競合ソフトウェア情報
以下の競合製品を認識し、言及がある場合は分析に含めてください。
- ほのぼの NEXT（NDソフトウェア）: 業界最大手、多機能、高価格帯
- 介舟ファミリー（インフォコム）: 老舗、介護＆障害福祉対応、安定性重視
- ノウビー/Knoube（カナミックネットワーク）: クラウド型、医療連携に強い
- HUG（ネットアーツ）: 放課後デイ・障害福祉特化
- ワイズマン: 介護・福祉大手、長い実績、UIが古い
※ ソフトウェア未使用（Excel・紙運用）の事業所の声も重要な分析対象です。

## 機能評価軸（アスペクト）
各クラスター内で以下の機能への言及を集計してください。
- billing: 請求機能（国保連請求、加算計算、エラーチェック、返戻等）
- recording: 記録管理（利用者記録、出席管理、連絡帳等）
- care_plan: 支援計画（個別支援計画、アセスメント等）
- ui_ux: 操作性・UI（画面デザイン、使いやすさ、教育コスト等）
- support: サポート（問い合わせ対応、研修等）
- pricing: 価格（月額費用、初期費用、コスパ等）
- mobile: モバイル（スマホ・タブレット対応等）
- data_migration: データ移行（乗り換え、CSV取込等）
- reporting: 帳票・レポート（監査書類、統計出力等）

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
      "representative_post_indices": [0, 3],
      "feature_analysis": [
        {
          "aspect": "billing",
          "positive_count": 2,
          "negative_count": 1,
          "summary": "この機能に対する評価の要約"
        }
      ]
    }
  ]
}

注意:
- post_indicesは各投稿の[番号]を使用してください
- 1つの投稿は1つのクラスターにのみ所属させてください
- すべての投稿をいずれかのクラスターに含めてください
- sentiment_distributionはそのクラスター内の投稿の感情分布の数を数えてください
- representative_post_indicesはそのクラスターを代表する投稿2-3件を選んでください
- business_relevanceのlevelはhigh/medium/lowで、${PRODUCT_NAME}のビジネスにとっての重要度です
- feature_analysisは、そのクラスター内で言及されている機能のみ含めてください（言及がなければ空配列）
- feature_analysisのaspectは上記の機能評価軸のキーを使用してください`;
}
