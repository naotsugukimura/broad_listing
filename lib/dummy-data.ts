import type { SoftwareName, AspectSentiment, EmotionScores } from "@/types";

type DummyPost = {
  content: string;
  author: string;
  posted_at: string;
  sentiment: "positive" | "neutral" | "negative";
  software_mentioned: SoftwareName[];
  aspect_sentiments: AspectSentiment[];
  emotion_scores: EmotionScores;
};

// Plutchikの感情の輪に基づくデフォルト（全0）
const ZERO_EMOTIONS: EmotionScores = {
  joy: 0, trust: 0, anticipation: 0, surprise: 0,
  fear: 0, sadness: 0, anger: 0, disgust: 0,
};

// 30件のダミーSNS投稿
// 配分: かべなし(5), ほのぼの(4), 介舟(4), ノウビー(3), HUG(3), ワイズマン(3), 未使用(5), 複数比較(3)
export const DUMMY_POSTS: DummyPost[] = [
  // === かべなしクラウド (5件) ===
  {
    content: "かべなしクラウド導入して3ヶ月。国保連請求の作業時間が半分になった。請求エラーチェック機能が秀逸で、返戻がほぼゼロに。もっと早く入れればよかった。",
    author: "kabenashi_user_01",
    posted_at: "2026-03-01T09:15:00Z",
    sentiment: "positive",
    software_mentioned: ["kabenashi"],
    aspect_sentiments: [
      { aspect: "billing", sentiment: "positive", detail: "請求作業時間が半減、エラーチェックで返戻ほぼゼロ" },
    ],
    emotion_scores: { ...ZERO_EMOTIONS, joy: 3, trust: 2, anticipation: 1, surprise: 1 },
  },
  {
    content: "かべなしクラウドの操作研修をスタッフ向けにやったけど、UIが直感的でみんなすぐ覚えてくれた。ITリテラシー低めの職員でも半日で基本操作マスターできたのは大きい。",
    author: "kabenashi_trainer",
    posted_at: "2026-03-02T14:30:00Z",
    sentiment: "positive",
    software_mentioned: ["kabenashi"],
    aspect_sentiments: [
      { aspect: "ui_ux", sentiment: "positive", detail: "直感的UIで教育コスト低い" },
    ],
    emotion_scores: { ...ZERO_EMOTIONS, joy: 2, trust: 2, surprise: 1 },
  },
  {
    content: "かべなしクラウド、請求機能は素晴らしいんだけど、個別支援計画のテンプレートが少なすぎる。放課後デイ用のフォーマットが1種類しかないので結局手打ちが多い。",
    author: "kabenashi_user_02",
    posted_at: "2026-03-03T10:00:00Z",
    sentiment: "negative",
    software_mentioned: ["kabenashi"],
    aspect_sentiments: [
      { aspect: "billing", sentiment: "positive", detail: "請求機能は高評価" },
      { aspect: "care_plan", sentiment: "negative", detail: "テンプレートが少なく手打ち多い" },
    ],
    emotion_scores: { ...ZERO_EMOTIONS, trust: 1, anger: 1, sadness: 1 },
  },
  {
    content: "かべなしクラウドのモバイル版、外出先で記録入力する時にちょっと重い。特に写真添付するとフリーズすることがある。訪問系のサービスだと致命的。",
    author: "kabenashi_mobile",
    posted_at: "2026-03-04T16:45:00Z",
    sentiment: "negative",
    software_mentioned: ["kabenashi"],
    aspect_sentiments: [
      { aspect: "mobile", sentiment: "negative", detail: "動作が重く写真添付でフリーズ" },
      { aspect: "recording", sentiment: "negative", detail: "訪問先での記録入力に支障" },
    ],
    emotion_scores: { ...ZERO_EMOTIONS, anger: 2, disgust: 1, fear: 1 },
  },
  {
    content: "かべなしクラウドのサポート対応がめちゃくちゃ早い。チャットで質問したら10分で回答きた。前に使ってたソフトは電話しても繋がらなかったので感動。価格も月額が安くて助かる。",
    author: "kabenashi_fan",
    posted_at: "2026-03-05T08:20:00Z",
    sentiment: "positive",
    software_mentioned: ["kabenashi"],
    aspect_sentiments: [
      { aspect: "support", sentiment: "positive", detail: "チャット10分で回答、迅速対応" },
      { aspect: "pricing", sentiment: "positive", detail: "月額費用が安い" },
    ],
    emotion_scores: { ...ZERO_EMOTIONS, joy: 2, trust: 3, surprise: 2 },
  },

  // === ほのぼの NEXT (4件) ===
  {
    content: "ほのぼのNEXT、機能は確かに豊富だけどランニングコストが高すぎる。年間200万超えは小規模事業所には厳しい。機能を使い切れてない気がする。",
    author: "honobono_user_01",
    posted_at: "2026-03-01T12:00:00Z",
    sentiment: "negative",
    software_mentioned: ["honobono"],
    aspect_sentiments: [
      { aspect: "pricing", sentiment: "negative", detail: "年間200万超で小規模には高すぎる" },
      { aspect: "ui_ux", sentiment: "negative", detail: "多機能すぎて使い切れない" },
    ],
    emotion_scores: { ...ZERO_EMOTIONS, sadness: 2, anger: 1, fear: 1 },
  },
  {
    content: "ほのぼのNEXTの請求機能は安定してる。10年使ってて大きなトラブルなし。ただUIが古くて、新人に教えるのに時間がかかるのが難点。操作手順書が50ページある。",
    author: "honobono_vet",
    posted_at: "2026-03-03T13:10:00Z",
    sentiment: "neutral",
    software_mentioned: ["honobono"],
    aspect_sentiments: [
      { aspect: "billing", sentiment: "positive", detail: "10年間安定稼働" },
      { aspect: "ui_ux", sentiment: "negative", detail: "UIが古く教育コスト高い" },
    ],
    emotion_scores: { ...ZERO_EMOTIONS, trust: 2, sadness: 1 },
  },
  {
    content: "ほのぼのNEXTのサポート、電話がなかなか繋がらない。30分待ちはザラ。月末の請求時期は特にひどい。緊急時にこれだと不安。",
    author: "honobono_complaint",
    posted_at: "2026-03-06T09:00:00Z",
    sentiment: "negative",
    software_mentioned: ["honobono"],
    aspect_sentiments: [
      { aspect: "support", sentiment: "negative", detail: "電話30分待ち、月末は特に繋がらない" },
    ],
    emotion_scores: { ...ZERO_EMOTIONS, anger: 2, fear: 2, disgust: 1 },
  },
  {
    content: "ほのぼのNEXTの帳票出力機能は充実してる。監査対応の書類がワンクリックで出せるのは本当にありがたい。この点だけで他に乗り換えられない。",
    author: "honobono_kansa",
    posted_at: "2026-03-08T10:15:00Z",
    sentiment: "positive",
    software_mentioned: ["honobono"],
    aspect_sentiments: [
      { aspect: "reporting", sentiment: "positive", detail: "監査書類がワンクリックで出力可能" },
    ],
    emotion_scores: { ...ZERO_EMOTIONS, joy: 2, trust: 3 },
  },

  // === 介舟ファミリー (4件) ===
  {
    content: "介舟ファミリーの障害福祉対応、正直中途半端。介護保険側はしっかりしてるけど、障害福祉の加算計算が一部手動なのが痛い。結局Excelで検算してる。",
    author: "kaishu_user_01",
    posted_at: "2026-03-02T16:20:00Z",
    sentiment: "negative",
    software_mentioned: ["kaishu"],
    aspect_sentiments: [
      { aspect: "billing", sentiment: "negative", detail: "障害福祉の加算計算が一部手動" },
    ],
    emotion_scores: { ...ZERO_EMOTIONS, anger: 1, sadness: 2, disgust: 1 },
  },
  {
    content: "介舟ファミリーのデータ移行サポートは丁寧だった。旧システムからのCSV取り込みも手伝ってもらえて助かった。ただ移行後のUIに慣れるまで1ヶ月かかった。",
    author: "kaishu_migration",
    posted_at: "2026-03-04T10:45:00Z",
    sentiment: "neutral",
    software_mentioned: ["kaishu"],
    aspect_sentiments: [
      { aspect: "data_migration", sentiment: "positive", detail: "移行サポートが丁寧" },
      { aspect: "ui_ux", sentiment: "negative", detail: "慣れるまで1ヶ月かかる" },
    ],
    emotion_scores: { ...ZERO_EMOTIONS, trust: 2, anticipation: 1, sadness: 1 },
  },
  {
    content: "介舟ファミリーの記録管理機能、テンプレートのカスタマイズ性が高いのが良い。事業所独自の記録様式をそのまま再現できた。ベテラン職員が紙と同じ感覚で使えてる。",
    author: "kaishu_kiroku",
    posted_at: "2026-03-07T09:50:00Z",
    sentiment: "positive",
    software_mentioned: ["kaishu"],
    aspect_sentiments: [
      { aspect: "recording", sentiment: "positive", detail: "テンプレートカスタマイズ性が高い" },
      { aspect: "ui_ux", sentiment: "positive", detail: "紙と同じ感覚で使える" },
    ],
    emotion_scores: { ...ZERO_EMOTIONS, joy: 2, trust: 2 },
  },
  {
    content: "介舟ファミリー、オンプレミス版はサーバー管理が大変。クラウド版もあるけど追加料金がかかる。災害時のデータバックアップが不安。",
    author: "kaishu_infra",
    posted_at: "2026-03-09T14:30:00Z",
    sentiment: "negative",
    software_mentioned: ["kaishu"],
    aspect_sentiments: [
      { aspect: "pricing", sentiment: "negative", detail: "クラウド版は追加料金" },
    ],
    emotion_scores: { ...ZERO_EMOTIONS, fear: 2, sadness: 1, anger: 1 },
  },

  // === ノウビー Knoube (3件) ===
  {
    content: "ノウビーの医療連携機能がすごい。主治医への情報共有がシステム上で完結する。多職種連携が必要な重度障害の利用者さんのケースで特に威力を発揮してる。",
    author: "knoube_user_01",
    posted_at: "2026-03-05T14:30:00Z",
    sentiment: "positive",
    software_mentioned: ["knoube"],
    aspect_sentiments: [
      { aspect: "recording", sentiment: "positive", detail: "医療連携・多職種情報共有が優秀" },
    ],
    emotion_scores: { ...ZERO_EMOTIONS, joy: 2, trust: 3, anticipation: 1 },
  },
  {
    content: "ノウビー使ってるけど、請求機能が弱い。国保連への伝送でエラーが出やすくて、結局手動で修正することが多い。医療側は強いのに福祉請求はイマイチ。",
    author: "knoube_billing",
    posted_at: "2026-03-07T11:15:00Z",
    sentiment: "negative",
    software_mentioned: ["knoube"],
    aspect_sentiments: [
      { aspect: "billing", sentiment: "negative", detail: "国保連伝送でエラー多発、手動修正が必要" },
    ],
    emotion_scores: { ...ZERO_EMOTIONS, anger: 2, sadness: 1, disgust: 1 },
  },
  {
    content: "ノウビーのクラウド環境は安定してる。サーバーダウンの経験なし。ただモバイルアプリがなくてブラウザ経由なので、タブレットだと操作しづらい部分がある。",
    author: "knoube_cloud",
    posted_at: "2026-03-10T08:00:00Z",
    sentiment: "neutral",
    software_mentioned: ["knoube"],
    aspect_sentiments: [
      { aspect: "mobile", sentiment: "negative", detail: "モバイルアプリなし、ブラウザ経由で操作しづらい" },
    ],
    emotion_scores: { ...ZERO_EMOTIONS, trust: 2, sadness: 1 },
  },

  // === HUG (3件) ===
  {
    content: "HUGは放課後デイに特化してるだけあって、送迎管理や保護者連絡機能が本当に便利。連絡帳がアプリで完結するので、紙の連絡帳を忘れる問題が解消された。",
    author: "hug_user_01",
    posted_at: "2026-03-06T11:15:00Z",
    sentiment: "positive",
    software_mentioned: ["hug"],
    aspect_sentiments: [
      { aspect: "recording", sentiment: "positive", detail: "送迎管理・連絡帳アプリが便利" },
      { aspect: "mobile", sentiment: "positive", detail: "アプリで連絡帳が完結" },
    ],
    emotion_scores: { ...ZERO_EMOTIONS, joy: 3, trust: 2 },
  },
  {
    content: "HUGを就労支援B型で使おうとしたけど、放課後デイ向けの設計すぎて合わない。工賃管理や作業記録の機能がないので、結局別ソフトも併用する羽目に。",
    author: "hug_b_gata",
    posted_at: "2026-03-08T16:00:00Z",
    sentiment: "negative",
    software_mentioned: ["hug"],
    aspect_sentiments: [
      { aspect: "recording", sentiment: "negative", detail: "就労支援向け機能（工賃管理等）がない" },
      { aspect: "care_plan", sentiment: "negative", detail: "放課後デイ以外の事業種に対応不足" },
    ],
    emotion_scores: { ...ZERO_EMOTIONS, sadness: 2, anger: 1, disgust: 1 },
  },
  {
    content: "HUGの価格は放課後デイ1事業所あたりで考えるとリーズナブル。ただ多事業所展開すると割高になる。グループホームと放デイ両方やってる法人だとコスト計算が微妙。",
    author: "hug_pricing",
    posted_at: "2026-03-10T13:40:00Z",
    sentiment: "neutral",
    software_mentioned: ["hug"],
    aspect_sentiments: [
      { aspect: "pricing", sentiment: "neutral", detail: "単事業所は安いが多事業所だと割高" },
    ],
    emotion_scores: { ...ZERO_EMOTIONS, anticipation: 1, fear: 1 },
  },

  // === ワイズマン (3件) ===
  {
    content: "ワイズマンのシステム、20年の実績は信頼できるけど、UIが本当に古い。Windows XP時代のような画面で若手職員が使いたがらない。そろそろモダンUIに刷新してほしい。",
    author: "wiseman_user_01",
    posted_at: "2026-03-09T10:30:00Z",
    sentiment: "negative",
    software_mentioned: ["wiseman"],
    aspect_sentiments: [
      { aspect: "ui_ux", sentiment: "negative", detail: "UIが古く若手職員が使いたがらない" },
    ],
    emotion_scores: { ...ZERO_EMOTIONS, sadness: 2, anger: 1, disgust: 2 },
  },
  {
    content: "ワイズマンの請求機能と帳票は正確。20年分のノウハウが詰まってる感じ。サポートも電話対応で安心感がある。ただ月額費用がじわじわ上がってきてるのが気になる。",
    author: "wiseman_vet",
    posted_at: "2026-03-10T14:30:00Z",
    sentiment: "neutral",
    software_mentioned: ["wiseman"],
    aspect_sentiments: [
      { aspect: "billing", sentiment: "positive", detail: "請求機能が正確で信頼性高い" },
      { aspect: "reporting", sentiment: "positive", detail: "帳票のノウハウが豊富" },
      { aspect: "support", sentiment: "positive", detail: "電話サポートで安心感" },
      { aspect: "pricing", sentiment: "negative", detail: "月額費用が上昇傾向" },
    ],
    emotion_scores: { ...ZERO_EMOTIONS, trust: 3, fear: 1 },
  },
  {
    content: "ワイズマンからクラウド型への乗り換えを検討中。データ移行が不安だけど、サーバー保守の手間を考えるともう限界。移行実績のあるベンダーに相談したい。",
    author: "wiseman_escape",
    posted_at: "2026-03-11T08:15:00Z",
    sentiment: "neutral",
    software_mentioned: ["wiseman"],
    aspect_sentiments: [
      { aspect: "data_migration", sentiment: "negative", detail: "クラウド移行時のデータ移行が不安" },
    ],
    emotion_scores: { ...ZERO_EMOTIONS, fear: 2, anticipation: 2, sadness: 1 },
  },

  // === ソフト未使用 (5件) ===
  {
    content: "うちの事業所、まだExcelと紙で全部管理してる。国保連請求は手計算でチェックしてて毎月3日かかる。返戻が怖くて夜眠れない。そろそろシステム入れないと限界。",
    author: "no_system_01",
    posted_at: "2026-03-01T15:30:00Z",
    sentiment: "negative",
    software_mentioned: ["none"],
    aspect_sentiments: [
      { aspect: "billing", sentiment: "negative", detail: "手計算で3日かかり返戻リスクが高い" },
    ],
    emotion_scores: { ...ZERO_EMOTIONS, fear: 3, sadness: 2, anger: 1 },
  },
  {
    content: "福祉ソフトの導入を上に提案したけど、コストを理由に却下された。年間100万は高いって。でも職員の残業代と返戻のリスクを考えたら絶対ペイするのに。",
    author: "no_system_02",
    posted_at: "2026-03-03T19:20:00Z",
    sentiment: "negative",
    software_mentioned: ["none"],
    aspect_sentiments: [
      { aspect: "pricing", sentiment: "negative", detail: "年間100万のコストが導入障壁" },
    ],
    emotion_scores: { ...ZERO_EMOTIONS, sadness: 2, anger: 2, anticipation: 1 },
  },
  {
    content: "利用者さんの個別支援計画をWordで作ってるけど、バージョン管理が地獄。誰がいつ修正したかわからなくなる。支援計画だけでもクラウド管理したい。",
    author: "no_system_03",
    posted_at: "2026-03-05T08:45:00Z",
    sentiment: "negative",
    software_mentioned: ["none"],
    aspect_sentiments: [
      { aspect: "care_plan", sentiment: "negative", detail: "Wordでバージョン管理ができない" },
      { aspect: "recording", sentiment: "negative", detail: "修正履歴が追えない" },
    ],
    emotion_scores: { ...ZERO_EMOTIONS, anger: 2, sadness: 1, fear: 1, disgust: 1 },
  },
  {
    content: "紙の出席簿で管理してたら、監査で記入漏れを大量に指摘された。利用実績の記録が不十分だと報酬減算のリスクがあるらしい。ICT導入補助金の活用を真剣に検討中。",
    author: "no_system_04",
    posted_at: "2026-03-07T12:00:00Z",
    sentiment: "negative",
    software_mentioned: ["none"],
    aspect_sentiments: [
      { aspect: "recording", sentiment: "negative", detail: "紙管理で記入漏れ、報酬減算リスク" },
    ],
    emotion_scores: { ...ZERO_EMOTIONS, fear: 3, sadness: 1, surprise: 1 },
  },
  {
    content: "小規模事業所だからシステム入れるほどでもないと思ってたけど、利用者が20人超えてからExcelが破綻した。無料トライアルのあるクラウドサービスを探してる。",
    author: "no_system_05",
    posted_at: "2026-03-09T17:00:00Z",
    sentiment: "neutral",
    software_mentioned: ["none"],
    aspect_sentiments: [
      { aspect: "pricing", sentiment: "neutral", detail: "無料トライアルで試したい" },
    ],
    emotion_scores: { ...ZERO_EMOTIONS, anticipation: 2, fear: 1 },
  },

  // === 複数ソフト比較 (3件) ===
  {
    content: "福祉ソフトを比較検討中。かべなしクラウドは価格が手頃で請求機能も良さそう。ほのぼのNEXTは高いけど帳票が充実。うちの規模だとかべなしかなぁ。",
    author: "hikaku_user_01",
    posted_at: "2026-03-04T13:15:00Z",
    sentiment: "neutral",
    software_mentioned: ["kabenashi", "honobono"],
    aspect_sentiments: [
      { aspect: "pricing", sentiment: "positive", detail: "かべなしは価格が手頃" },
      { aspect: "billing", sentiment: "positive", detail: "かべなしの請求機能が良い" },
      { aspect: "reporting", sentiment: "positive", detail: "ほのぼのは帳票が充実" },
      { aspect: "pricing", sentiment: "negative", detail: "ほのぼのは高価格" },
    ],
    emotion_scores: { ...ZERO_EMOTIONS, anticipation: 2, trust: 1 },
  },
  {
    content: "HUGからかべなしクラウドへの乗り換えを検討中。放課後デイだけならHUGで十分だけど、来年度から就労B型も開設するのでマルチ対応のソフトが必要になった。",
    author: "hikaku_user_02",
    posted_at: "2026-03-06T21:00:00Z",
    sentiment: "neutral",
    software_mentioned: ["hug", "kabenashi"],
    aspect_sentiments: [
      { aspect: "care_plan", sentiment: "positive", detail: "HUGは放課後デイに十分" },
      { aspect: "care_plan", sentiment: "negative", detail: "HUGは就労支援に非対応" },
    ],
    emotion_scores: { ...ZERO_EMOTIONS, anticipation: 2, trust: 1, fear: 1 },
  },
  {
    content: "ワイズマンからノウビーに移行した事業所の話を聞いた。データ移行は大変だったけど、クラウドになって災害時の安心感が全然違うらしい。うちもそろそろ決断しなきゃ。",
    author: "hikaku_user_03",
    posted_at: "2026-03-11T13:00:00Z",
    sentiment: "neutral",
    software_mentioned: ["wiseman", "knoube"],
    aspect_sentiments: [
      { aspect: "data_migration", sentiment: "negative", detail: "移行作業が大変" },
    ],
    emotion_scores: { ...ZERO_EMOTIONS, anticipation: 2, fear: 1, trust: 1 },
  },
];
