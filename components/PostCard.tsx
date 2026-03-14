"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SentimentIndicator } from "./SentimentIndicator";
import { ExternalLink } from "lucide-react";
import { SERVICE_TYPE_LABELS } from "@/types";
import type { SnsPost } from "@/types";

type Props = {
  post: SnsPost;
};

export function PostCard({ post }: Props) {
  const date = new Date(post.posted_at);
  const formatted = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

  const serviceTypes = (post.service_types ?? []).filter((s) => s !== "unknown");

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="space-y-2 p-4">
        <p className="text-sm leading-relaxed text-gray-800">{post.content}</p>

        {serviceTypes.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {serviceTypes.map((st) => (
              <Badge key={st} variant="outline" className="text-xs">
                {SERVICE_TYPE_LABELS[st] ?? st}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            {post.tweet_url ? (
              <a
                href={post.tweet_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:underline"
              >
                {post.author}
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <span>{post.author}</span>
            )}
            <span>{formatted}</span>
          </div>
          <SentimentIndicator sentiment={post.sentiment} size="sm" />
        </div>
      </CardContent>
    </Card>
  );
}
