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
    const image = formData.get("image");
    const url = formData.get("url") as string | null;
    
    if (!image || !url) {
      console.error("Invalid form data:", { image, url });
      return new Response("No image file and/or url provided", { status: 400 });
    }
    
    // Handle image data - check if it's a Blob-like object with arrayBuffer method
    let buffer: Buffer;
    let contentType: string;
    
    if (typeof image === 'object' && image !== null && 'arrayBuffer' in image && typeof image.arrayBuffer === 'function') {
      buffer = Buffer.from(await image.arrayBuffer());
      contentType = 'type' in image ? (image.type as string) : 'application/octet-stream';
    } else {
      console.error("Image is not in the expected format");
      return new Response("Invalid image format", { status: 400 });
    }
    
    const size = buffer.length;
    
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
