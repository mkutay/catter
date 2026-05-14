import { NextResponse } from "next/server";
import { getBlogViews } from "@/lib/database-queries/views";

export const revalidate = 360;
export const dynamic = "force-static";

/**
 * GET handler for fetching the total number of views across all blog posts.
 * This route is statically generated and revalidated every 360 seconds.
 *
 * @returns A response containing the total view count as a string.
 */
export async function GET() {
  const result = await getBlogViews();
  if (result.isErr()) {
    return new NextResponse("Error fetching all view count.", { status: 500 });
  }

  return new NextResponse(result.value.toString(), { status: 200 });
}
