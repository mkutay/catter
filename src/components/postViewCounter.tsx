import { incrementViews } from "@/lib/database-actions/views";
import { getViewCount } from "@/lib/database-queries/views";

export async function PostViewCounter({ slug }: { slug: string }) {
  const incremented = await incrementViews(slug);

  if (incremented.isErr()) {
    if (incremented.error.code === 'DATABASE_ERROR') {
      console.error('Database error in incrementing view:', incremented.error.message);
    } else {
      console.log('Not incrementing views:', incremented.error.message);
    }
  }

  const viewCountResult = await getViewCount({ slug });

  if (viewCountResult.isErr()) {
    console.error("Error in displaying view count for post " + slug + ":", viewCountResult.error.message);
    return;
  }

  const viewCount = viewCountResult.value;

  return (
    <span>
      {viewCount} views
    </span>
  );
}