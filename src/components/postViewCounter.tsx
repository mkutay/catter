"use client";

import { useEffect, useState } from "react";
import { incrementViewsAction } from "@/lib/server-helper";

export function PostViewCounter({ slug }: { slug: string }) {
  const [viewCount, setViewCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchViewCount = async () => {
      const views = await incrementViewsAction({ slug });
      setViewCount(views.ok ? views.value : null);
    };

    fetchViewCount();
  }, [slug]);

  if (viewCount === null) {
    return null;
  }

  return <span>{viewCount} views</span>;
}
