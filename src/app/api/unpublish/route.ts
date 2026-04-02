import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import z from "zod";
import { env } from "@/env";
import { db } from "@/lib/db/drizzle";
import { postKeywords, posts, postTags } from "@/lib/db/schema";
import { createPost } from "@/lib/dbContentQueries";

const schema = z.object({
  content: z.string(),
  slug: z.string(),
});

export async function POST(request: Request) {
  const authHeader = request.headers.get("Authorization");
  const apiKey = env.UPLOAD_API_KEY;

  if (!authHeader || authHeader !== `Bearer ${apiKey}`) {
    return NextResponse.json(
      { error: "Unauthorized" },
      {
        status: 401,
      },
    );
  }

  try {
    const body = await request.json();
    const { content, slug } = schema.parse(body);

    const post = createPost(content, slug);
    await deleteFromDB(post.slug);

    revalidatePath("/projects");
    revalidatePath(`/posts/${slug}`);
    revalidatePath(`/${post.shortened}`);
    revalidatePath("/tags", "layout");
    revalidatePath("/posts/page/[id]", "page");
    revalidatePath("/", "page");
    revalidatePath("/feed.xml");

    return new NextResponse("", { status: 200 });
  } catch (error) {
    console.error("Error uploading image:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error occurred.";
    return NextResponse.json(
      { error: message },
      {
        status: 500,
      },
    );
  }
}

const deleteFromDB = async (slug: string) => {
  await db.delete(postTags).where(eq(postTags.slug, slug));
  await db.delete(postKeywords).where(eq(postKeywords.slug, slug));

  await db.delete(posts).where(eq(posts.slug, slug));
};
