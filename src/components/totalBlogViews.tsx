'use client';

import { getBlogViews } from "@/lib/database-actions/views";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";

export function TotalBlogViews() {
  const [views, setViews] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchViews = async () => {
      const views = await getBlogViews();
      setViews(views.ok ? views.value : null);
      setIsLoading(false);
    }
    fetchViews();
  }, []);

  if (isLoading) return <div className="flex justify-center items-center text-primary">
    <Skeleton className="h-7 w-40" />
  </div>

  return (
    <div className="flex justify-center items-center text-primary font-bold tracking-tight text-lg">
      {`${views} total views`}
    </div>
  );
}