import { NextResponse } from "next/server";
import { getPosts } from '@/lib/contentQueries';

export async function GET() {
  const posts = getPosts({ });

  return NextResponse.json(posts);
}