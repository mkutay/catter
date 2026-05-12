import { safeTry } from "neverthrow";
import { type NextRequest, NextResponse } from "next/server";
import { incrementViews } from "@/lib/database-actions/views";
import { getViewCount } from "@/lib/database-queries/views";

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
