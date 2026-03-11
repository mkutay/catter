import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { env } from "@/env";
import { db } from "@/lib/db/drizzle";
import { postKeywords, posts, postTags } from "@/lib/db/schema";
import { createPost } from "@/lib/dbContentQueries";

export async function POST(request: Request) {
  const authHeader = request.headers.get("Authorization");
  const apiKey = env.UPLOAD_API_KEY;

  if (!apiKey) {
    return new Response("API key not configured on server", { status: 500 });
  }

  if (!authHeader || authHeader !== `Bearer ${apiKey}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const body = await request.json();
    const content = body.content as string;
    const slug = body.slug as string;

    const post = createPost(content, slug);

    await deleteFromDB(post.slug);

    revalidatePath("/projects");
    revalidatePath(`/posts/${slug}`);
    revalidatePath(`/${post.shortened}`);
    revalidatePath("/tags", "layout");
    revalidatePath("/posts/page/[id]", "page");
    revalidatePath("/", "page");

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return new Response(JSON.stringify({ error: "Failed to upload image" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

const deleteFromDB = async (slug: string) => {
  await db.delete(postTags).where(eq(postTags.slug, slug));
  await db.delete(postKeywords).where(eq(postKeywords.slug, slug));

  await db.delete(posts).where(eq(posts.slug, slug));
};
