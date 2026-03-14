-- 拡張分析カラムの追加
-- ABSA（アスペクトベース感情分析）、Plutchik感情スコア、ソフトウェア言及検出

-- sns_postsテーブルに拡張分析カラムを追加
ALTER TABLE sns_posts
  ADD COLUMN IF NOT EXISTS software_mentioned TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS aspect_sentiments JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS emotion_scores JSONB NOT NULL DEFAULT '{"joy":0,"trust":0,"anticipation":0,"surprise":0,"fear":0,"sadness":0,"anger":0,"disgust":0}';

-- post_clustersテーブルに機能別評価カラムを追加
ALTER TABLE post_clusters
  ADD COLUMN IF NOT EXISTS feature_analysis JSONB NOT NULL DEFAULT '[]';

-- ソフトウェア言及での検索用インデックス
CREATE INDEX IF NOT EXISTS idx_sns_posts_software ON sns_posts USING GIN (software_mentioned);
