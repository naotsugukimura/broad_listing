"use client";

import { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { SummaryCards } from "./SummaryCards";
import { ClusterChart } from "./ClusterChart";
import { ClusterCard } from "./ClusterCard";
import { PostCard } from "./PostCard";
import { SentimentIndicator } from "./SentimentIndicator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Database, Brain, Loader2, RefreshCw } from "lucide-react";
import type { SnsPost, PostCluster, ClusteringRun } from "@/types";

type Props = {
  initialPosts: SnsPost[];
  initialClusters: PostCluster[];
  initialRuns: ClusteringRun[];
};

export function DashboardClient({
  initialPosts,
  initialClusters,
  initialRuns,
}: Props) {
  const [posts, setPosts] = useState(initialPosts);
  const [clusters, setClusters] = useState(initialClusters);
  const [runs, setRuns] = useState(initialRuns);
  const [collecting, setCollecting] = useState(false);
  const [clustering, setClustering] = useState(false);
  const [sentimentFilter, setSentimentFilter] = useState<string>("all");
  const [message, setMessage] = useState<string | null>(null);

  const refreshData = useCallback(async () => {
    const [postsRes, clustersRes, runsRes] = await Promise.all([
      fetch("/api/posts"),
      fetch("/api/clusters-data"),
      fetch("/api/runs-data"),
    ]);
    const postsData = await postsRes.json();
    const clustersData = await clustersRes.json();
    const runsData = await runsRes.json();
    setPosts(postsData.posts || []);
    setClusters(clustersData.clusters || []);
    setRuns(runsData.runs || []);
  }, []);

  const handleCollect = async () => {
    setCollecting(true);
    setMessage(null);
    try {
      const res = await fetch("/api/collect", { method: "POST" });
      const data = await res.json();
      setMessage(data.message || data.error);
      await refreshData();
    } catch {
      setMessage("データ収集に失敗しました");
    } finally {
      setCollecting(false);
    }
  };

  const handleCluster = async () => {
    setClustering(true);
    setMessage(null);
    try {
      const res = await fetch("/api/cluster", { method: "POST" });
      const data = await res.json();
      setMessage(data.message || data.error);
      await refreshData();
    } catch {
      setMessage("クラスタリングに失敗しました");
    } finally {
      setClustering(false);
    }
  };

  const filteredPosts =
    sentimentFilter === "all"
      ? posts
      : posts.filter((p) => p.sentiment === sentimentFilter);

  const latestRun = runs.length > 0 ? runs[0] : null;

  return (
    <div className="space-y-6">
      {/* アクションバー */}
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={handleCollect} disabled={collecting}>
          {collecting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Database className="mr-2 h-4 w-4" />
          )}
          データ収集
        </Button>
        <Button
          onClick={handleCluster}
          disabled={clustering || posts.length === 0}
          variant="secondary"
        >
          {clustering ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Brain className="mr-2 h-4 w-4" />
          )}
          クラスタリング実行
        </Button>
        <Button onClick={refreshData} variant="outline" size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>

        {message && (
          <span className="rounded bg-blue-50 px-3 py-1 text-sm text-blue-700">
            {message}
          </span>
        )}

        {latestRun && (
          <span className="ml-auto text-xs text-gray-500">
            最終実行: {new Date(latestRun.created_at).toLocaleString("ja-JP")} / {latestRun.status}
          </span>
        )}
      </div>

      {/* タブ */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">概要</TabsTrigger>
          <TabsTrigger value="clusters">クラスター</TabsTrigger>
          <TabsTrigger value="posts">投稿一覧</TabsTrigger>
        </TabsList>

        {/* 概要タブ */}
        <TabsContent value="overview" className="space-y-6">
          <SummaryCards posts={posts} clusters={clusters} />

          {clusters.length > 0 && <ClusterChart clusters={clusters} />}

          {/* 感情分析概要 */}
          {posts.length > 0 && (
            <div className="rounded-lg border p-4">
              <h3 className="mb-3 font-semibold">感情分析サマリー</h3>
              <div className="flex flex-wrap gap-6">
                {(["positive", "neutral", "negative"] as const).map((s) => {
                  const count = posts.filter((p) => p.sentiment === s).length;
                  const pct =
                    posts.length > 0
                      ? Math.round((count / posts.length) * 100)
                      : 0;
                  return (
                    <div key={s} className="flex items-center gap-2">
                      <SentimentIndicator sentiment={s} />
                      <span className="text-sm font-medium">
                        {count}件 ({pct}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {posts.length === 0 && (
            <div className="rounded-lg border border-dashed p-12 text-center text-gray-500">
              <p>データがありません。「データ収集」ボタンでダミーデータを投入してください。</p>
            </div>
          )}
        </TabsContent>

        {/* クラスタータブ */}
        <TabsContent value="clusters" className="space-y-4">
          {clusters.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {clusters.map((cluster) => (
                <ClusterCard key={cluster.id} cluster={cluster} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-12 text-center text-gray-500">
              <p>
                クラスターがありません。データ収集後に「クラスタリング実行」をクリックしてください。
              </p>
            </div>
          )}
        </TabsContent>

        {/* 投稿一覧タブ */}
        <TabsContent value="posts" className="space-y-4">
          <div className="flex items-center gap-3">
            <Select
              value={sentimentFilter}
              onValueChange={(v) => v && setSentimentFilter(v)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="感情フィルタ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                <SelectItem value="positive">ポジティブ</SelectItem>
                <SelectItem value="neutral">中立</SelectItem>
                <SelectItem value="negative">ネガティブ</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-500">
              {filteredPosts.length}件表示
            </span>
          </div>

          {filteredPosts.length > 0 ? (
            <div className="space-y-3">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-12 text-center text-gray-500">
              <p>投稿がありません。</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
