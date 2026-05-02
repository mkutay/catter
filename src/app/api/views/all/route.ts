import { NextResponse } from "next/server";
import { getBlogViews } from "@/lib/database-queries/views";

export const revalidate = 360;
export const dynamic = "force-static";

export async function GET() {
  const result = await getBlogViews();
  if (result.isErr()) {
    return new NextResponse("Error fetching all view count.", { status: 500 });
  }

  return new NextResponse(result.value.toString(), { status: 200 });
}
