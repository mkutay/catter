'use client';

import { incrementViews } from "@/lib/database-actions/views";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";

export const dynamic = 'force-dynamic';

export function PostViewCounter({ slug }: { slug: string }) {
  const [viewCount, setViewCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchViewCount = async () => {
      const views = await incrementViews(slug);
      if (!views.ok) {
        console.error(`Error incrementing views for ${slug}:`, views.error.message);
        setViewCount(null);
      } else {
        setViewCount(views.value);
      }
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