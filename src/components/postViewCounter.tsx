'use client';

import { useEffect, useState } from "react";

import { Skeleton } from "./ui/skeleton";
import Server from "@/lib/server";

export function PostViewCounter({ slug }: { slug: string }) {
  const [viewCount, setViewCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchViewCount = async () => {
      const views = await Server.Views.Increment({ slug });
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