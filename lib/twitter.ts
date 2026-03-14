import TwitterApi from "twitter-api-v2";
import { SEARCH_TIERS } from "@/lib/constants";
import type { SearchTier } from "@/lib/constants";

export type RawTweet = {
  id: string;
  text: string;
  author_id: string;
  author_username: string;
  created_at: string;
  search_tier?: string;
};

const client = new TwitterApi(process.env.X_BEARER_TOKEN!);
const readOnlyClient = client.readOnly;

/**
 * ティアのキーワードからXクエリ文字列を構築
 * - andKeywords:   (word1 word2) 形式 → 両方含むツイートにヒット
 * - exactPhrases:  "phrase" 形式   → 完全一致
 */
function buildTierQuery(tier: SearchTier): string {
  const parts: string[] = [];

  for (const kw of tier.andKeywords) {
    parts.push(`(${kw})`);
  }
  for (const phrase of tier.exactPhrases) {
    parts.push(`"${phrase}"`);
  }

  const combined = parts.join(" OR ");
  return `(${combined}) -is:retweet -is:reply lang:ja`;
}

/**
 * 全ティアでXの投稿を検索（直近7日間）
 * 優先度順にティアを実行し、重複を除いて結果を統合
 */
export async function searchTweets(): Promise<RawTweet[]> {
  const allTweets: RawTweet[] = [];
  const seenIds = new Set<string>();

  // ティアを優先度順にソート
  const sortedTiers = Object.entries(SEARCH_TIERS)
    .sort(([, a], [, b]) => a.priority - b.priority);

  for (const [tierKey, tier] of sortedTiers) {
    if (tier.andKeywords.length === 0 && tier.exactPhrases.length === 0) continue;

    const query = buildTierQuery(tier);

    try {
      const result = await readOnlyClient.v2.search(query, {
        max_results: tier.maxResults,
        "tweet.fields": ["created_at", "author_id", "text"],
        "user.fields": ["username"],
        expansions: ["author_id"],
      });

      const users = new Map<string, string>();
      if (result.includes?.users) {
        for (const user of result.includes.users) {
          users.set(user.id, user.username);
        }
      }

      for (const tweet of result.data?.data ?? []) {
        if (seenIds.has(tweet.id)) continue;
        seenIds.add(tweet.id);

        allTweets.push({
          id: tweet.id,
          text: tweet.text,
          author_id: tweet.author_id ?? "",
          author_username: users.get(tweet.author_id ?? "") ?? "unknown",
          created_at: tweet.created_at ?? new Date().toISOString(),
          search_tier: tierKey,
        });
      }

      console.log(`[X Search] ${tier.label}: ${result.data?.data?.length ?? 0}件取得`);
    } catch (error) {
      // ティア単位でエラーを吸収し、次のティアへ続行
      console.error(`[X Search] ${tier.label} でエラー:`, error);
    }
  }

  console.log(`[X Search] 合計: ${allTweets.length}件（重複除去済）`);
  return allTweets;
}
