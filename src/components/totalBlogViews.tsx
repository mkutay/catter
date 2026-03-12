"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";

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
      <div className="flex justify-center items-center text-primary">
        <Skeleton className="h-7 w-40" />
      </div>
    );

  return (
    <div className="flex justify-center items-center text-primary font-bold tracking-tight text-lg">
      {`${views} total views`}
    </div>
  );
}
