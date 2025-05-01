'use client';

import { useEffect, useState } from "react";

import { incrementViews } from "@/lib/database-actions/views";
import { Skeleton } from "./ui/skeleton";

export function PostViewCounter({ slug }: { slug: string }) {
  const [viewCount, setViewCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchViewCount = async () => {
      const views = await incrementViews(slug);
      setViewCount(views.ok ? views.value : null);
      setIsLoading(false);
    };

    fetchViewCount();
  }, [slug]);

  if (isLoading) {
    return <Skeleton className="h-6 w-20" />;
  }

  if (viewCount === null) {
    return null;
  }

  return (
    <span>
      {viewCount} views
    </span>
  );
}