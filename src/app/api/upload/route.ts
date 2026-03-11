import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { Post } from "@/config/types";
import { env } from "@/env";
import { db } from "@/lib/db/drizzle";
import { postKeywords, posts, postTags, views } from "@/lib/db/schema";
import { createPost } from "@/lib/dbContentQueries";
import { uploadImage } from "@/lib/images";

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
    const formData = await request.formData();

    const content = formData.get("content") as string;
    const slug = formData.get("slug") as string;
    const images = formData.getAll("images") as File[];

    // Upload images with better error handling and concurrency control
    if (images.length > 0) {
      const uploadPromises = images.map(async (image, index) => {
        try {
          const maxSize = 15 * 1024 * 1024; // 15MB
          if (image.size > maxSize) {
            throw new Error(
              `Image ${image.name} is too large. Maximum size is ${maxSize}MB.`,
            );
          }

          const buffer = Buffer.from(await image.arrayBuffer());
          await uploadImage(image.name, buffer, image.size, image.type);
          console.log(
            `Successfully uploaded image ${index + 1}/${images.length}: ${image.name}`,
          );
        } catch (error) {
          console.error(`Failed to upload image ${image.name}:`, error);
          throw new Error(
            `Failed to upload image ${image.name}: ${error instanceof Error ? error.message : "Unknown error"}`,
          );
        }
      });

      // Wait for all uploads to complete
      await Promise.all(uploadPromises);
    }

    const post = createPost(content, slug);

    await insertIntoDB({ post });

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
    console.error("Error in upload API:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    const isImageUploadError =
      errorMessage.includes("Failed to upload image") ||
      errorMessage.includes("too large");

    return new Response(
      JSON.stringify({
        error: isImageUploadError ? errorMessage : "Failed to process upload",
        details: env.NODE_ENV === "development" ? errorMessage : undefined,
      }),
      {
        status: isImageUploadError ? 400 : 500,
        headers: {
          "Content-Type": "application/json",
        },
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
      coversquare: post.coverSquare,
      lastmodified: post.lastModified,
      shortened: post.shortened,
      shortexcerpt: post.shortExcerpt,
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
        coversquare: post.coverSquare,
        lastmodified: post.lastModified,
        shortened: post.shortened,
        shortexcerpt: post.shortExcerpt,
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
