import TwitterApi from "twitter-api-v2";
import { SEARCH_KEYWORDS } from "@/lib/constants";
import { X_MAX_RESULTS_PER_QUERY } from "@/lib/constants";

export type RawTweet = {
  id: string;
  text: string;
  author_id: string;
  author_username: string;
  created_at: string;
};

const client = new TwitterApi(process.env.X_BEARER_TOKEN!);
const readOnlyClient = client.readOnly;

/**
 * キーワードでXの投稿を検索（直近7日間）
 * Basic tierのRecent Search APIを使用
 */
export async function searchTweets(): Promise<RawTweet[]> {
  const allTweets: RawTweet[] = [];
  const seenIds = new Set<string>();

  // キーワードをOR結合してクエリを構築（RTとリプライを除外、日本語のみ）
  const query = SEARCH_KEYWORDS.map((kw) => `"${kw}"`).join(" OR ");
  const fullQuery = `(${query}) -is:retweet -is:reply lang:ja`;

  try {
    const result = await readOnlyClient.v2.search(fullQuery, {
      max_results: X_MAX_RESULTS_PER_QUERY,
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
      });
    }
  } catch (error) {
    console.error("X API search error:", error);
    throw error;
  }

  return allTweets;
}
