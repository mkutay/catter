import type { Readable } from "node:stream";
import { chunkToUint8Array, getImage } from "@/lib/images";

/** MIME types served by this proxy route. */
const ALLOWED_CONTENT_TYPES: Record<string, string> = {
  // Images:
  avif: "image/avif",
  bmp: "image/bmp",
  gif: "image/gif",
  ico: "image/x-icon",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  png: "image/png",
  svg: "image/svg+xml",
  tif: "image/tiff",
  tiff: "image/tiff",
  webp: "image/webp",
  // Documents:
  md: "text/markdown; charset=utf-8",
  markdown: "text/markdown; charset=utf-8",
  pdf: "application/pdf",
};

/**
 * Converts a Node.js `Readable` to a Web `ReadableStream<Uint8Array>` for streaming responses.
 */
const toUint8WebStream = (stream: Readable): ReadableStream<Uint8Array> => {
  const iterator = stream[Symbol.asyncIterator]();

  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      const { done, value } = await iterator.next();
      if (done) return controller.close();
      const arr = chunkToUint8Array(value).match(
        (a) => a,
        (err) => {
          throw new Error(err.message);
        },
      );
      controller.enqueue(arr);
    },
    async cancel(reason) {
      stream.destroy(reason instanceof Error ? reason : undefined);
      await iterator.return?.();
    },
  });
};

/**
 * Proxy route that streams S3 objects to the client with appropriate content-type headers.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ image: string[] }> },
) {
  const { image } = await params;
  const decodedImage = image.map(decodeURIComponent);
  const ext = decodedImage[decodedImage.length - 1]
    .split(".")
    .pop()
    ?.toLowerCase();

  if (!ext) {
    return new Response("Missing file extension.", { status: 400 });
  }

  if (!(ext in ALLOWED_CONTENT_TYPES)) {
    return new Response("Unsupported file type.", { status: 415 });
  }

  const contentType = ALLOWED_CONTENT_TYPES[ext];
  const fullUrl = `/${decodedImage.join("/")}`;

  return (await getImage(fullUrl)).match(
    (stream) =>
      new Response(toUint8WebStream(stream), {
        headers: { "Content-Type": contentType },
      }),
    (err) => new Response(err.message, { status: 404 }),
  );
}
