'use client';

import { getViewCount } from "@/lib/database-actions/views";
import { useEffect, useState } from "react";

export function ViewDisplay({ slug }: { slug: string }) {
  const [views, setViews] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchViewCount = async () => {
      const views = await getViewCount({ slug });
      setViews(views.ok ? views.value : null);
      setIsLoading(false);
    };

    fetchViewCount();
  }, [slug]);

  if (isLoading) return null;

  return (
    <p>
      {views} views
    </p>
  );
}