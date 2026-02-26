import { getImage } from "@/lib/images";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ image: string[] }> },
) {
  const { image } = await params;
  const decodedImage = image.map(decodeURIComponent);
  const ext = decodedImage[decodedImage.length - 1].split(".").pop();
  const fullUrl = `/${decodedImage.join("/")}`;
  const contentType = `image/${ext}`;

  const imageStream = await getImage(fullUrl);

  // This is dubious
  return new Response(imageStream as unknown as ReadableStream<Uint8Array>, {
    headers: {
      "Content-Type": contentType,
    },
  });
}
