import { getViewCount } from "@/lib/database-queries/views";

export const dynamic = 'force-dynamic';

export async function PostViewCounter({ slug }: { slug: string }) {
  const viewCountResult = await getViewCount({ slug });

  if (viewCountResult.isErr()) {
    console.error("Error in displaying view count for post " + slug + ":", viewCountResult.error.message);
    return;
  }

  return (
    <span>
      {viewCountResult.value} views
    </span>
  );
}