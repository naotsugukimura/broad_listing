import { createClient } from "@supabase/supabase-js";
import { DashboardClient } from "@/components/DashboardClient";

export const dynamic = "force-dynamic";

async function getData() {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const [postsResult, clustersResult, runsResult] = await Promise.all([
    supabase
      .from("sns_posts")
      .select("*")
      .not("tweet_url", "is", null)
      .order("posted_at", { ascending: false }),
    supabase
      .from("post_clusters")
      .select("*")
      .order("post_count", { ascending: false }),
    supabase
      .from("clustering_runs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  return {
    posts: postsResult.data || [],
    clusters: clustersResult.data || [],
    runs: runsResult.data || [],
  };
}

export default async function Home() {
  const { posts, clusters, runs } = await getData();

  return (
    <DashboardClient
      initialPosts={posts}
      initialClusters={clusters}
      initialRuns={runs}
    />
  );
}
