import { type NextRequest, NextResponse } from "next/server";
import { getComments } from "@/lib/database-queries/comments";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  if (!slug) {
    return new NextResponse("Missing slug parameter.", { status: 400 });
  }

  const result = await getComments({ slug });
  if (result.isErr()) {
    return new NextResponse("Error fetching comments.", { status: 500 });
  }

  return NextResponse.json(result.value, { status: 200 });
}
