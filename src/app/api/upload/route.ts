import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import z from "zod";
import type { Post } from "@/config/types";
import { env } from "@/env";
import { createPost } from "@/lib/content-queries";
import { db } from "@/lib/db/drizzle";
import { postKeywords, posts, postTags, views } from "@/lib/db/schema";
import { uploadImage } from "@/lib/images";

const schema = z.object({
  content: z.string(),
  slug: z.string(),
  files: z.array(z.instanceof(File)),
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
    const formData = await request.formData();
    const { content, slug, files } = schema.parse({
      content: formData.get("content"),
      slug: formData.get("slug"),
      files: formData.getAll("files"),
    });

    // Upload images with better error handling and concurrency control
    await Promise.all(
      files.map(async (image, index) => {
        const maxSize = 15 * 1024 * 1024; // 15MB
        if (image.size > maxSize) {
          throw new Error(
            `Image ${image.name} is too large. Maximum size is ${maxSize}MB.`,
          );
        }

        const buffer = Buffer.from(await image.arrayBuffer());
        const uploadResult = await uploadImage(
          image.name,
          buffer,
          image.size,
          image.type,
        );

        if (uploadResult.isErr()) {
          throw new Error(uploadResult.error.message);
        }

        console.log(
          `Successfully uploaded image ${index + 1}/${files.length}: ${image.name}`,
        );
      }),
    );

    const post = createPost(content, slug);
    await insertIntoDB({ post });

    revalidatePath("/projects");
    revalidatePath(`/posts/${slug}`);
    revalidatePath(`/${post.shortened}`);
    revalidatePath("/tags", "layout");
    revalidatePath("/posts/page/[id]", "page");
    revalidatePath("/", "page");
    revalidatePath("/feed.xml");

    return new NextResponse("", { status: 200 });
  } catch (error) {
    console.error("Error in upload API:", error);

    const message =
      error instanceof Error ? error.message : "Unknown error occurred.";

    return NextResponse.json(
      {
        error: message,
      },
      {
        status: 500,
      },
    );
  }
}

const insertIntoDB = async ({ post }: { post: Post }) => {
  await db
    .insert(posts)
    .values({
      slug: post.slug,
      content: post.content,
      title: post.title,
      description: post.description,
      date: post.date,
      excerpt: post.excerpt,
      locale: post.locale,
      cover: post.cover,
      coverSquare: post.coverSquare,
      lastModified: post.lastModified,
      shortened: post.shortened,
      shortExcerpt: post.shortExcerpt,
    })
    .onConflictDoUpdate({
      target: posts.slug,
      set: {
        content: post.content,
        title: post.title,
        description: post.description,
        date: post.date,
        excerpt: post.excerpt,
        locale: post.locale,
        cover: post.cover,
        coverSquare: post.coverSquare,
        lastModified: post.lastModified,
        shortened: post.shortened,
        shortExcerpt: post.shortExcerpt,
      },
    });

  // Delete existing tags and keywords for this post and re-insert them
  await db.delete(postTags).where(eq(postTags.slug, post.slug));
  await db.delete(postKeywords).where(eq(postKeywords.slug, post.slug));

  if (post.tags.length > 0) {
    await db
      .insert(postTags)
      .values(post.tags.map((tag) => ({ slug: post.slug, tag })))
      .onConflictDoNothing();
  }

  if (post.keywords.length > 0) {
    await db
      .insert(postKeywords)
      .values(post.keywords.map((keyword) => ({ slug: post.slug, keyword })))
      .onConflictDoNothing();
  }

  await db
    .insert(views)
    .values({ slug: post.slug, count: 0 })
    .onConflictDoNothing();
};
