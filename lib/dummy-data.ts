type DummyPost = {
  content: string;
  author: string;
  posted_at: string;
  sentiment: "positive" | "neutral" | "negative";
};

// 50件のダミーSNS投稿
// カテゴリ: 福祉・介護業界全般(15件), かべなしクラウド関連(10件), 福祉DX・業務課題(25件)
export const DUMMY_POSTS: DummyPost[] = [
  // === 福祉・介護業界全般 (15件) ===
  {
    content: "国保連への請求作業、毎月月初に3日かかってる。もっと効率化できないかな。紙の書類確認が地獄すぎる。",
    author: "welfare_worker_01",
    posted_at: "2026-03-01T09:15:00Z",
    sentiment: "negative",
  },
  {
    content: "介護記録のIT化が進まない理由、結局は現場のリテラシーだけじゃなくて、使いにくいシステムにも問題がある気がする。",
    author: "kaigo_manager",
    posted_at: "2026-03-02T14:30:00Z",
    sentiment: "negative",
  },
  {
    content: "障害福祉サービスの報酬改定、来年度どうなるんだろう。加算の計算がどんどん複雑になっていく…",
    author: "syougai_fukushi",
    posted_at: "2026-03-03T10:00:00Z",
    sentiment: "neutral",
  },
  {
    content: "支援員が足りなすぎて、記録業務に時間を割けない。利用者さんと向き合う時間がどんどん減っていく。",
    author: "shien_staff_a",
    posted_at: "2026-03-03T16:45:00Z",
    sentiment: "negative",
  },
  {
    content: "福祉業界の人手不足、深刻すぎる。求人出しても全然集まらない。給与水準の問題だけじゃないと思うんだけど。",
    author: "fukushi_jinji",
    posted_at: "2026-03-04T08:20:00Z",
    sentiment: "negative",
  },
  {
    content: "今日の研修で福祉DXの話を聞いてきた。ICT補助金を活用すれば、かなりのコスト削減ができるらしい。うちも検討しよう。",
    author: "facility_director",
    posted_at: "2026-03-04T18:00:00Z",
    sentiment: "positive",
  },
  {
    content: "利用者のアセスメントシートの管理、Excelだと限界を感じる。でもどのシステムがいいのかわからない。",
    author: "sw_tokumei",
    posted_at: "2026-03-05T11:30:00Z",
    sentiment: "neutral",
  },
  {
    content: "グループホームの夜勤、記録を手書きしてるけど、朝の引き継ぎまでに清書する時間がない。タブレット入力にしたい。",
    author: "gh_night_worker",
    posted_at: "2026-03-05T23:15:00Z",
    sentiment: "negative",
  },
  {
    content: "放課後デイの送迎管理、紙の表で管理してるけど変更があるたびに書き直しで大変。デジタル化したい。",
    author: "houkago_day",
    posted_at: "2026-03-06T09:00:00Z",
    sentiment: "negative",
  },
  {
    content: "処遇改善加算の計算、毎回ヒヤヒヤする。間違えたら返戻になるし、チェックリスト作っても不安は消えない。",
    author: "jimu_tantou",
    posted_at: "2026-03-06T13:40:00Z",
    sentiment: "negative",
  },
  {
    content: "福祉施設のBCP策定、ようやく着手できた。ICTツールでバックアップ体制を整えられるのはありがたい。",
    author: "bcp_manager",
    posted_at: "2026-03-07T10:20:00Z",
    sentiment: "positive",
  },
  {
    content: "就労継続支援B型の工賃向上、ずっと課題だけど、作業管理のデジタル化で少しは改善できるかもしれない。",
    author: "b_gata_staff",
    posted_at: "2026-03-07T15:10:00Z",
    sentiment: "neutral",
  },
  {
    content: "児童発達支援の個別支援計画、紙ベースだと保護者との共有が大変。オンラインで見られるようにならないかな。",
    author: "jidou_hattatsu",
    posted_at: "2026-03-08T09:30:00Z",
    sentiment: "neutral",
  },
  {
    content: "福祉現場で使えるAI、そろそろ本格的に検討する時期だと思う。記録の自動生成とか、面談の要約とか。",
    author: "ai_fukushi_fan",
    posted_at: "2026-03-08T14:00:00Z",
    sentiment: "positive",
  },
  {
    content: "相談支援専門員の書類業務が多すぎる。サービス等利用計画の作成だけで1日が終わる。本来の相談支援ができない。",
    author: "soudan_shien",
    posted_at: "2026-03-09T11:45:00Z",
    sentiment: "negative",
  },

  // === かべなしクラウド関連 (10件) ===
  {
    content: "かべなしクラウド導入して3ヶ月。国保連請求の作業時間が半分になった。もっと早く入れればよかった。",
    author: "kabenashi_user_01",
    posted_at: "2026-03-01T12:00:00Z",
    sentiment: "positive",
  },
  {
    content: "かべなしクラウドの操作研修、スタッフ向けにやったけど、UIがわかりやすいのでみんなすぐ覚えてくれた。",
    author: "kabenashi_trainer",
    posted_at: "2026-03-02T16:20:00Z",
    sentiment: "positive",
  },
  {
    content: "かべなしクラウド、請求機能は良いんだけど、個別支援計画のテンプレートがもう少し充実してほしい。",
    author: "kabenashi_user_02",
    posted_at: "2026-03-03T13:10:00Z",
    sentiment: "neutral",
  },
  {
    content: "福祉ソフトを比較検討中。かべなしクラウドは価格が手頃で機能も十分そう。無料トライアルから始めてみようかな。",
    author: "kentou_chuu",
    posted_at: "2026-03-04T10:45:00Z",
    sentiment: "positive",
  },
  {
    content: "かべなしクラウドのサポート対応がめちゃくちゃ早い。チャットで質問したら10分で回答きた。これは助かる。",
    author: "kabenashi_fan",
    posted_at: "2026-03-05T14:30:00Z",
    sentiment: "positive",
  },
  {
    content: "かべなしクラウドに利用者の出席管理機能があると嬉しい。今は別のスプレッドシートで管理してるので二度手間。",
    author: "kabenashi_user_03",
    posted_at: "2026-03-06T11:15:00Z",
    sentiment: "neutral",
  },
  {
    content: "かべなしクラウドのモバイル版、もう少しサクサク動くようになるといいな。外出先で記録入力する時にちょっと重い。",
    author: "mobile_user",
    posted_at: "2026-03-07T09:50:00Z",
    sentiment: "negative",
  },
  {
    content: "うちの事業所、かべなしクラウドに移行完了。前のシステムからのデータ移行もスムーズだった。満足！",
    author: "migration_done",
    posted_at: "2026-03-08T16:00:00Z",
    sentiment: "positive",
  },
  {
    content: "かべなしクラウドの請求エラーチェック機能、返戻が激減した。これだけでも導入した価値がある。",
    author: "seikyu_tantou",
    posted_at: "2026-03-09T10:30:00Z",
    sentiment: "positive",
  },
  {
    content: "かべなしクラウドとほのぼのNEXT、どっちにするか迷ってる。価格差が結構あるけど機能差はどうなんだろう。",
    author: "hikaku_user",
    posted_at: "2026-03-10T08:00:00Z",
    sentiment: "neutral",
  },

  // === 福祉DX・業務課題 (25件) ===
  {
    content: "返戻の通知が来るたびに胃が痛くなる。請求ソフトのチェック機能がもっと賢くなってほしい。",
    author: "henrei_kowai",
    posted_at: "2026-03-01T15:30:00Z",
    sentiment: "negative",
  },
  {
    content: "福祉系のシステムベンダー、だいたいUIが古い。令和なのに平成初期みたいな画面のソフトが多すぎる。",
    author: "ui_complaint",
    posted_at: "2026-03-01T20:00:00Z",
    sentiment: "negative",
  },
  {
    content: "ICT導入補助金の申請書類を作成中。補助率3/4はありがたいけど、申請手続き自体がアナログなの矛盾してない？",
    author: "hojokin_apply",
    posted_at: "2026-03-02T09:00:00Z",
    sentiment: "neutral",
  },
  {
    content: "職員の勤怠管理と利用者の記録が別システムなのが非効率すぎる。一元管理できるサービスないかな。",
    author: "ichigen_kanri",
    posted_at: "2026-03-02T12:30:00Z",
    sentiment: "negative",
  },
  {
    content: "福祉施設のペーパーレス化、進めたいけど監査の時に紙で出さないといけない書類が多すぎて結局印刷してる。",
    author: "paperless_muri",
    posted_at: "2026-03-03T08:45:00Z",
    sentiment: "negative",
  },
  {
    content: "ほのぼのNEXTからの乗り換えを検討中。ランニングコストが高すぎて、クラウド型の安いサービスに移りたい。",
    author: "honobono_escape",
    posted_at: "2026-03-03T19:20:00Z",
    sentiment: "negative",
  },
  {
    content: "福祉ソフトの導入で一番大変なのは、スタッフへの教育コスト。使いやすさが何より大事だと実感した。",
    author: "dounyu_keiken",
    posted_at: "2026-03-04T13:15:00Z",
    sentiment: "neutral",
  },
  {
    content: "今使ってるコロンブスの請求ソフト、サポート終了のお知らせが来た。移行先どうしよう…",
    author: "columbus_user",
    posted_at: "2026-03-04T17:30:00Z",
    sentiment: "negative",
  },
  {
    content: "タブレットで訪問記録を入力できるようになって、事務所に戻ってからの転記作業がなくなった。DX万歳。",
    author: "tablet_happy",
    posted_at: "2026-03-05T08:30:00Z",
    sentiment: "positive",
  },
  {
    content: "障害福祉の報酬計算、加算の種類が多すぎてExcelの関数では限界。専用ソフトの導入を上申した。",
    author: "excel_limit",
    posted_at: "2026-03-05T16:00:00Z",
    sentiment: "neutral",
  },
  {
    content: "福祉現場でChrome bookを導入してみた。コスパ最高だけど、対応してないソフトがあるのが困る。",
    author: "chromebook_user",
    posted_at: "2026-03-06T07:45:00Z",
    sentiment: "neutral",
  },
  {
    content: "月末の請求締め作業、今月も残業確定。自動チェック機能があるソフトに変えたい。切実。",
    author: "zangyou_tsurai",
    posted_at: "2026-03-06T21:00:00Z",
    sentiment: "negative",
  },
  {
    content: "実地指導で記録の不備を指摘された。デジタル記録なら漏れを防げたのに…と後悔してる。",
    author: "jicchi_shidou",
    posted_at: "2026-03-07T12:00:00Z",
    sentiment: "negative",
  },
  {
    content: "福祉DXセミナーに参加。AIで支援記録を自動生成する事例が紹介されてて、未来を感じた。",
    author: "dx_seminar",
    posted_at: "2026-03-07T18:30:00Z",
    sentiment: "positive",
  },
  {
    content: "利用者のご家族からの問い合わせ対応、記録が一元化されてないと過去の経緯を追えなくて困る。",
    author: "kazoku_taiou",
    posted_at: "2026-03-08T10:15:00Z",
    sentiment: "negative",
  },
  {
    content: "福祉ソフトの料金体系、ユーザー数課金は小規模事業所にとってはつらい。定額制のサービスが増えてほしい。",
    author: "ryoukin_mondai",
    posted_at: "2026-03-08T13:45:00Z",
    sentiment: "negative",
  },
  {
    content: "LITALICOの障害福祉向けシステム、大手だけあって安心感はあるけど、カスタマイズ性が低いのがネック。",
    author: "litalico_review",
    posted_at: "2026-03-09T08:00:00Z",
    sentiment: "neutral",
  },
  {
    content: "クラウド型の福祉ソフト、災害時にもデータが守られるのが良い。BCP対策としても有効。",
    author: "cloud_advocate",
    posted_at: "2026-03-09T14:20:00Z",
    sentiment: "positive",
  },
  {
    content: "請求ソフトのデータを会計ソフトに連携できたら、経理の手間がめちゃくちゃ減るのに。API連携希望。",
    author: "kaikei_renkei",
    posted_at: "2026-03-09T17:00:00Z",
    sentiment: "neutral",
  },
  {
    content: "新しく入った職員がシステムの使い方わからなくて、結局ベテランが代わりに入力してる。本末転倒。",
    author: "vet_tantou",
    posted_at: "2026-03-10T09:30:00Z",
    sentiment: "negative",
  },
  {
    content: "福祉施設の経営者向けダッシュボード機能がほしい。稼働率、売上、職員配置を一目で把握したい。",
    author: "keieisha_view",
    posted_at: "2026-03-10T11:00:00Z",
    sentiment: "neutral",
  },
  {
    content: "ワイズマンのシステム、歴史は長いけどそろそろモダンなUIに刷新してほしい。若手職員が使いたがらない。",
    author: "wiseman_user",
    posted_at: "2026-03-10T14:30:00Z",
    sentiment: "negative",
  },
  {
    content: "福祉DX補助金、今年度の募集始まったみたい。ICT機器の導入とクラウドサービス両方使えるのかな？",
    author: "hojokin_check",
    posted_at: "2026-03-11T08:15:00Z",
    sentiment: "neutral",
  },
  {
    content: "サービス担当者会議の記録をAIで議事録化してくれるサービスがあったら絶対使う。誰か作ってくれ。",
    author: "gijiroku_hope",
    posted_at: "2026-03-11T13:00:00Z",
    sentiment: "neutral",
  },
  {
    content: "職員間の情報共有ツール、LINEグループだと個人情報管理的にまずい。業務用チャットに移行したい。",
    author: "jouhou_kyouyuu",
    posted_at: "2026-03-12T10:00:00Z",
    sentiment: "neutral",
  },
];
