"use client";

import { Card, CardContent } from "@/components/ui/card";
import { SentimentIndicator } from "./SentimentIndicator";
import type { SnsPost } from "@/types";

type Props = {
  post: SnsPost;
};

export function PostCard({ post }: Props) {
  const date = new Date(post.posted_at);
  const formatted = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

  return (
    <Card>
      <CardContent className="space-y-2 p-4">
        <p className="text-sm leading-relaxed text-gray-800">{post.content}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span>@{post.author}</span>
            <span>{formatted}</span>
          </div>
          <SentimentIndicator sentiment={post.sentiment} size="sm" />
        </div>
      </CardContent>
    </Card>
  );
}
