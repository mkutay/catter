"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";

/**
 * Displays the total number of views for all blog posts.
 *
 * Shows a loading indicator while fetching the view count,
 * then displays the total number of views.
 */
export function TotalBlogViews() {
  const [views, setViews] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchViews = async () => {
      const text = await fetch("/api/views/all").then((res) => res.text());
      const count = parseInt(text, 10);
      if (!Number.isNaN(count)) {
        setViews(count);
      } else {
        console.error("Failed to parse view count:", text);
      }
      setIsLoading(false);
    };
    fetchViews();
  }, []);

  if (isLoading)
    return (
      <div className="flex text-primary">
        <Skeleton className="h-7 w-43.75" />
      </div>
    );

  return (
    <div className="flex text-primary font-bold tracking-tight md:text-lg text-base font-mono leading-5">
      {views} total views
    </div>
  );
}
