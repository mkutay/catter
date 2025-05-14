import { getImage } from "@/lib/minio";

export async function GET(request: Request, { params }: { params: Promise<{ image: string[] }> }) {
  const { image } = await params;
  const ext = image[image.length - 1].split('.').pop();
  const fullUrl = '/' + image.join('/');
  const contentType = 'image/' + ext;
  
  const imageStream = await getImage(fullUrl);
  
  // This is dubious
  return new Response(imageStream as unknown as ReadableStream<Uint8Array>, {
    headers: {
      'Content-Type': contentType,
    },
  });
}