import { NextResponse } from "next/server";
import sitemap from "@/app/sitemap";

export async function GET() {
  const retSitemap = await sitemap();

  return NextResponse.json(retSitemap);
}