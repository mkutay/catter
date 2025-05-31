import { revalidatePath } from "next/cache";

import { Post } from "@/config/types";
import { uploadImage } from "@/lib/images";
import { sql } from "@/lib/postgres";
import { createPost } from "@/lib/dbContentQueries";

export async function POST(request: Request) {
  const authHeader = request.headers.get("Authorization");
  const apiKey = process.env.UPLOAD_API_KEY;
  
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

    for (const image of images) {
      const buffer = Buffer.from(await image.arrayBuffer());
      await uploadImage(image.name, buffer, image.size, image.type);
    }

    const post = createPost(content, slug);

    await insertIntoDB({ post });

    revalidatePath("/projects");
    revalidatePath(`/posts/${slug}`);
    revalidatePath(`/${post.shortened}`);
    revalidatePath("/tags", "layout");
    revalidatePath("/posts/page/[id]", "page");
    
    return new Response(JSON.stringify({ success: true }), {
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return new Response(JSON.stringify({ error: "Failed to upload image" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}

const insertIntoDB = async ({ post }: { post: Post }) => {  
  await sql`
    INSERT INTO posts (slug, content, title, description, date, excerpt, locale, cover, coverSquare, lastModified, shortened, shortExcerpt)
    VALUES (${post.slug}, ${post.content}, ${post.title}, ${post.description}, ${post.date}, ${post.excerpt}, ${post.locale}, ${post.cover}, ${post.coverSquare}, ${post.lastModified}, ${post.shortened}, ${post.shortExcerpt})
    ON CONFLICT (slug) DO UPDATE SET
      content = ${post.content},
      title = ${post.title},
      description = ${post.description},
      date = ${post.date},
      excerpt = ${post.excerpt},
      locale = ${post.locale},
      cover = ${post.cover},
      coverSquare = ${post.coverSquare},
      lastModified = ${post.lastModified},
      shortened = ${post.shortened},
      shortExcerpt = ${post.shortExcerpt}
  `;

  // Delete existing tags and keywords for this post and re-insert them
  await sql`DELETE FROM post_tags WHERE slug = ${post.slug}`;
  await sql`DELETE FROM post_keywords WHERE slug = ${post.slug}`;

  for (const tag of post.tags) {
    await sql`
      INSERT INTO post_tags (slug, tag)
      VALUES (${post.slug}, ${tag})
      ON CONFLICT (slug, tag) DO NOTHING;
    `;
  }

  for (const keyword of post.keywords) {
    await sql`
      INSERT INTO post_keywords (slug, keyword)
      VALUES (${post.slug}, ${keyword})
      ON CONFLICT (slug, keyword) DO NOTHING;
    `
  }

  await sql`
    INSERT INTO views (slug, count)
    VALUES (${post.slug}, 0)
    ON CONFLICT (slug) DO NOTHING;
  `;
}