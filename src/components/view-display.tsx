import { safeTry } from "neverthrow";
import { incrementViews } from "@/lib/database-actions/views";
import { getViewCount } from "@/lib/database-queries/views";

/**
 * Component that displays the view count for a post with a given
 * slug, and optionally increments it.
 *
 * @param slug The slug of the post to display the view count for.
 * @param increment Whether to increment the view count.
 */
export async function ViewDisplay({
  slug,
  increment = false,
}: {
  slug: string;
  increment?: boolean;
}) {
  const result = await safeTry(async function* () {
    if (increment) yield* incrementViews({ slug });
    return getViewCount({ slug });
  });

  if (result.isErr()) return null;
  const views = result.value;

  if (views === 1) return <p>1 view</p>;
  return <p>{views} views</p>;
}

export function ViewDisplaySkeleton() {
  return null;
}
