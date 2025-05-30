import matter from "gray-matter";

import { Post } from "@/config/types";
import { sql } from "@/lib/postgres";
import { revalidatePath } from "next/cache";

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

function createPost(content: string, slug: string): Post {
  const { data: frontmatter } = matter(content);

  // Helper function to safely get string value
  const getStringValue = (value: unknown, defaultValue: string): string => {
    return typeof value === 'string' ? value : defaultValue;
  };

  const getDateValue = (value: unknown, defaultValue: string) => {
    if (value instanceof Date) return value.toISOString();
    if (value) return new Date(value as string).toISOString();
    return defaultValue;
  };

  const contentWithoutFrontmatter = content.replace(/---[\s\S]*?---/, "").trim();
  
  const description = contentWithoutFrontmatter.slice(0, 150) + "...";
  slug = getStringValue(frontmatter.slug, slug);
  
  // Helper function to safely get string array
  const getStringArray = (value: unknown): string[] => {
    return Array.isArray(value) ? value.filter(item => typeof item === 'string') as string[] : [];
  };
  
  // Create the post object
  const post: Post = {
    slug,
    title: getStringValue(frontmatter.title, slug),
    content,
    description: getStringValue(frontmatter.description, description),
    date: getDateValue(frontmatter.date, new Date().toISOString()),
    excerpt: getStringValue(frontmatter.excerpt, ''),
    locale: getStringValue(frontmatter.locale, "en_UK"),
    cover: typeof frontmatter.cover === 'string' ? frontmatter.cover : null,
    coverSquare: typeof frontmatter.coverSquare === 'string' ? frontmatter.coverSquare : null,
    lastModified: getDateValue(frontmatter.lastModified, new Date().toISOString()),
    shortened: getStringValue(frontmatter.shortened, slug),
    shortExcerpt: getStringValue(frontmatter.shortExcerpt, ''),
    tags: getStringArray(frontmatter.tags),
    keywords: getStringArray(frontmatter.keywords)
  };
  
  return post;
}

const deleteFromDB = async (slug: string) => {
  await sql`DELETE FROM post_tags WHERE slug = ${slug}`;
  await sql`DELETE FROM post_keywords WHERE slug = ${slug}`;
  
  // Then delete the post itself
  await sql`DELETE FROM posts WHERE slug = ${slug}`;
}