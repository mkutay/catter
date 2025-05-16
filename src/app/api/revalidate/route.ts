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
    const formData = await request.formData();
    
    const slug = formData.get("slug");
    const tags = formData.get("tags");
    const shortened = formData.get("shortened");

    revalidatePath("/projects");
    
    if (slug) {
      revalidatePath(`/posts/${slug}`);
      revalidatePath(`/${shortened}`);
    }
    
    if (tags) {
      const tagsList = typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : [];
      
      tagsList.forEach(tag => {
        if (tag) {
          revalidatePath(`/tags/${tag}`);
          revalidatePath(`/tags/${tag}/page/[id]`, "page");
        }
      });
      
      revalidatePath("/tags");
    }
    
    revalidatePath("/posts/page/[id]", "page");
    
    return new Response(JSON.stringify({ success: true }), {
      headers: {
        "Content-Type": "application/json"
      }
    });

  } catch (error) {
    console.error("Error revalidating:", error);
    return new Response(JSON.stringify({ error: "Failed to revalidate" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}