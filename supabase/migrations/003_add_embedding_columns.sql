-- ベクトルマップ用カラムの追加
-- Gemini Embedding のベクトル（768次元）をJSONBで保存
-- UMAP 2次元座標を保存

ALTER TABLE sns_posts
  ADD COLUMN IF NOT EXISTS embedding JSONB,
  ADD COLUMN IF NOT EXISTS umap_x DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS umap_y DOUBLE PRECISION;

-- UMAP座標での検索用インデックス
CREATE INDEX IF NOT EXISTS idx_sns_posts_umap ON sns_posts (umap_x, umap_y) WHERE umap_x IS NOT NULL;
