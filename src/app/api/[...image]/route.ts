import type { Readable } from "node:stream";
import { getImage } from "@/lib/images";

const ALLOWED_CONTENT_TYPES: Record<string, string> = {
  // Images
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
  // Documents
  md: "text/markdown; charset=utf-8",
  markdown: "text/markdown; charset=utf-8",
  pdf: "application/pdf",
};

const toUint8WebStream = (stream: Readable): ReadableStream<Uint8Array> => {
  const iterator = stream[Symbol.asyncIterator]();

  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      const { done, value } = await iterator.next();

      if (done) {
        controller.close();
        return;
      }

      if (value instanceof Uint8Array) {
        controller.enqueue(value);
        return;
      }

      if (typeof value === "string") {
        controller.enqueue(new TextEncoder().encode(value));
        return;
      }

      if (value instanceof ArrayBuffer) {
        controller.enqueue(new Uint8Array(value));
        return;
      }

      if (ArrayBuffer.isView(value)) {
        controller.enqueue(
          new Uint8Array(value.buffer, value.byteOffset, value.byteLength),
        );
        return;
      }

      throw new TypeError("Unexpected stream chunk type.");
    },
    async cancel(reason) {
      stream.destroy(reason instanceof Error ? reason : undefined);
      await iterator.return?.();
    },
  });
};

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

  const contentType = ALLOWED_CONTENT_TYPES[ext];

  if (!contentType) {
    return new Response("Unsupported file type.", { status: 415 });
  }

  const fullUrl = `/${decodedImage.join("/")}`;

  const imageStream = await getImage(fullUrl);
  const responseStream = toUint8WebStream(imageStream);

  return new Response(responseStream, {
    headers: {
      "Content-Type": contentType,
    },
  });
}
