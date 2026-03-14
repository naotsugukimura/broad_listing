-- ツイートID・URLカラム追加（元投稿へのリンク用）
ALTER TABLE sns_posts ADD COLUMN IF NOT EXISTS tweet_id TEXT;
ALTER TABLE sns_posts ADD COLUMN IF NOT EXISTS tweet_url TEXT;

-- tweet_idでの検索用インデックス
CREATE UNIQUE INDEX IF NOT EXISTS idx_sns_posts_tweet_id ON sns_posts (tweet_id) WHERE tweet_id IS NOT NULL;
