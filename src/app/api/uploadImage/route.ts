import { uploadImage } from "@/lib/minio";

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
    
    // Get the image file from the form data
    const file = formData.get("image");
    const url = formData.get("url") as string | null;
    
    if (!file || !(file instanceof File) || !url) {
      console.error("Invalid form data:", { file, url });
      return new Response("No image file and/or url provided", { status: 400 });
    }
    
    const buffer = Buffer.from(await file.arrayBuffer());
    const size = buffer.length;
    const contentType = file.type;
    
    await uploadImage(url, buffer, size, contentType);
    
    return new Response(JSON.stringify({ success: true, url }), {
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
