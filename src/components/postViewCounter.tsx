'use client';

import { useEffect, useState } from "react";

import Server from "@/lib/server";

export function PostViewCounter({ slug }: { slug: string }) {
  const [viewCount, setViewCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchViewCount = async () => {
      const views = await Server.Views.Increment({ slug });
      setViewCount(views.ok ? views.value : null);
    };

    fetchViewCount();
  }, [slug]);

  if (viewCount === null) {
    return null;
  }

  return (
    <span>
      {viewCount} views
    </span>
  );
}