import { NextResponse } from "next/server";
import { getBlogViews } from "@/lib/database-queries/views";

export async function GET() {
  const result = await getBlogViews();
  if (result.isErr()) {
    return new NextResponse("Error fetching all view count.", { status: 500 });
  }

  return new NextResponse(result.value.toString(), { status: 200 });
}
