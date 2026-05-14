import { safeTry } from "neverthrow";
import { type NextRequest, NextResponse } from "next/server";
import { incrementViews } from "@/lib/database-actions/views";
import { getViewCount } from "@/lib/database-queries/views";

/**
 * GET handler for fetching or incrementing the view count of a specific post.
 *
 * @param request The incoming Next.js request object.
 *  - query param `slug`: The unique identifier for the post.
 *  - query param `increment`: (Optional) "true" to increment the view count.
 * @returns A response containing the view count or an error message.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  if (!slug) {
    return new NextResponse("Missing slug parameter", { status: 400 });
  }

  const increment = searchParams.get("increment") === "true";

  const result = await safeTry(async function* () {
    if (increment) yield* incrementViews({ slug });

    return getViewCount({ slug });
  });

  if (result.isErr()) {
    return new NextResponse(result.error.message, { status: 500 });
  }

  return new NextResponse(result.value.toString(), { status: 200 });
}
