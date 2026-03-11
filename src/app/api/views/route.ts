import { type NextRequest, NextResponse } from "next/server";
import { getViewCount } from "@/lib/database-queries/views";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  if (!slug) {
    return new NextResponse("Missing slug parameter", { status: 400 });
  }

  const result = await getViewCount({ slug });
  if (result.isErr()) {
    return new NextResponse("Error fetching view count", { status: 500 });
  }

  return new NextResponse(result.value.toString(), { status: 200 });
}
