import { NextResponse } from "next/server";
import getPosts from '@/app/lib/getPosts';

export async function GET() {
  const posts = getPosts({ });

  return NextResponse.json(posts);
}