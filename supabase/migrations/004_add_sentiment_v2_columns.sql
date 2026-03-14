-- 感情分析 v2: 5段階スコア + CoT理由 + サービス種別 + キーワード + 検索ティア
ALTER TABLE sns_posts
  ADD COLUMN IF NOT EXISTS sentiment_score SMALLINT,
  ADD COLUMN IF NOT EXISTS sentiment_reason TEXT,
  ADD COLUMN IF NOT EXISTS service_types TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS key_keywords TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS search_tier TEXT;

-- sentiment_scoreの有効範囲チェック
ALTER TABLE sns_posts
  ADD CONSTRAINT chk_sentiment_score
  CHECK (sentiment_score IS NULL OR (sentiment_score >= 1 AND sentiment_score <= 5));

-- サービス種別での検索用インデックス
CREATE INDEX IF NOT EXISTS idx_sns_posts_service_types
  ON sns_posts USING GIN (service_types);

-- 検索ティアでの絞り込み用インデックス
CREATE INDEX IF NOT EXISTS idx_sns_posts_search_tier
  ON sns_posts (search_tier);
