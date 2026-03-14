-- クラスタリング実行テーブル
CREATE TABLE IF NOT EXISTS clustering_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  total_posts INTEGER NOT NULL DEFAULT 0,
  cluster_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- クラスターテーブル
CREATE TABLE IF NOT EXISTS post_clusters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL REFERENCES clustering_runs(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  summary TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('pain_point', 'feature_request', 'competitor', 'industry_trend', 'positive_feedback', 'other')),
  post_count INTEGER NOT NULL DEFAULT 0,
  sentiment_distribution JSONB NOT NULL DEFAULT '{"positive":0,"neutral":0,"negative":0}',
  business_relevance JSONB NOT NULL DEFAULT '{"level":"low","reason":"","actionable_insight":""}',
  representative_posts TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- SNS投稿テーブル
CREATE TABLE IF NOT EXISTS sns_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'dummy' CHECK (source IN ('x', 'dummy')),
  posted_at TIMESTAMPTZ NOT NULL,
  sentiment TEXT NOT NULL DEFAULT 'neutral' CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  cluster_id UUID REFERENCES post_clusters(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- contentでの重複排除用ユニークインデックス
CREATE UNIQUE INDEX IF NOT EXISTS idx_sns_posts_content ON sns_posts (content);

-- 検索用インデックス
CREATE INDEX IF NOT EXISTS idx_sns_posts_cluster_id ON sns_posts (cluster_id);
CREATE INDEX IF NOT EXISTS idx_sns_posts_posted_at ON sns_posts (posted_at);
CREATE INDEX IF NOT EXISTS idx_sns_posts_source ON sns_posts (source);
CREATE INDEX IF NOT EXISTS idx_sns_posts_sentiment ON sns_posts (sentiment);
CREATE INDEX IF NOT EXISTS idx_post_clusters_run_id ON post_clusters (run_id);
