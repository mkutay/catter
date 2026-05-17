import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { getBlogViews } from "@/lib/database-queries/views";
import { Skeleton } from "./ui/skeleton";

/**
 * Displays the total number of views for all blog posts.
 */
export async function TotalBlogViews() {
  "use cache";
  cacheLife("minutes");
  const result = await getBlogViews();
  if (result.isErr()) return null;

  return (
    <div className="flex text-primary font-bold tracking-tight md:text-lg text-base font-mono leading-5">
      {result.value} total views
    </div>
  );
}

/**
 * Skeleton component for the total blog views.
 */
export function TotalBlogViewsSkeleton() {
  return (
    <div className="flex text-primary">
      <Skeleton className="h-7 w-43.75" />
    </div>
  );
}
