import type { Readable } from "node:stream";
import * as Minio from "minio";
import {
  err,
  ok,
  okAsync,
  type Result,
  ResultAsync,
  safeTry,
} from "neverthrow";
import { getPlaiceholder } from "plaiceholder";
import { env } from "@/env";

/**
 * The Minio client for interacting with the S3-compatible storage.
 */
export const minioClient = new Minio.Client({
  endPoint: env.MINIO_ENDPOINT,
  accessKey: env.MINIO_ACCESS_KEY,
  secretKey: env.MINIO_SECRET_KEY,
  useSSL: true,
  region: env.MINIO_REGION,
  partSize: 5 * 1024 * 1024, // 5 MB multipart threshold.
});

type ErrorBase<T extends string> = { type: T; message: string };

export type ChunkConvertError = ErrorBase<"CHUNK_CONVERT_ERROR">;
export type GetImageError = ErrorBase<"GET_IMAGE_ERROR">;
export type UploadImageError = ErrorBase<"UPLOAD_FAIL">;
export type PlaceholderError =
  | GetImageError
  | ErrorBase<"IMAGE_STREAM_ERROR">
  | ErrorBase<"PLACEHOLDER_ERROR">
  | ChunkConvertError;

export type PlaceholderResult = Awaited<ReturnType<typeof getPlaiceholder>>;

/** S3 object keys must not start with a leading slash or request signatures break. */
const normalizeKey = (key: string) => key.replace(/^\/+/, "");

/** Converts an error to a human-readable message, falling back to a generic message if unknown. */
const toMessage = (
  error: unknown,
  fallback: string = "Unknown error.",
): string => (error instanceof Error ? error.message : fallback);

/**
 * Normalises a single Node.js stream chunk to `Uint8Array`.
 *
 * @param chunk The chunk to normalise.
 * @returns A `Result` containing the normalised `Uint8Array` or a `ChunkConvertError`.
 */
export const chunkToUint8Array = (
  chunk: unknown,
): Result<Uint8Array, ChunkConvertError> => {
  if (chunk instanceof Uint8Array) return ok(chunk);
  if (typeof chunk === "string") return ok(Buffer.from(chunk));
  if (chunk instanceof ArrayBuffer) return ok(new Uint8Array(chunk));
  if (ArrayBuffer.isView(chunk))
    return ok(new Uint8Array(chunk.buffer, chunk.byteOffset, chunk.byteLength));
  return err({
    type: "CHUNK_CONVERT_ERROR",
    message: `Failed to convert chunk to Uint8Array. Type error.`,
  });
};

/** Fetch an S3 object as a Node.js `Readable`. */
export const getImage = (url: string): ResultAsync<Readable, GetImageError> =>
  ResultAsync.fromPromise(
    minioClient.getObject(env.S3_BUCKET_NAME, normalizeKey(url)),
    (error: unknown): GetImageError => ({
      type: "GET_IMAGE_ERROR",
      message: `Failed to get image from S3: ${toMessage(error)}`,
    }),
  );

/**
 * Upload a buffer to S3 under the given key.
 *
 * @param url The S3 key to upload to.
 * @param buffer The buffer to upload.
 * @param size The size of the buffer.
 * @param contentType The content type of the buffer.
 * @returns A `ResultAsync` that resolves to `UploadedObjectInfo` on success,
 * or an error on failure.
 */
export const uploadImage = (
  url: string,
  buffer: Buffer,
  size: number,
  contentType: string,
) =>
  ResultAsync.fromPromise(
    minioClient.putObject(env.S3_BUCKET_NAME, normalizeKey(url), buffer, size, {
      "Content-Type": contentType,
      "x-amz-acl": "public-read",
    }),
    (error: unknown): UploadImageError => ({
      type: "UPLOAD_FAIL",
      message: `Upload failed: ${toMessage(error)}`,
    }),
  );

/**
 * Convert a `Readable` stream to a `Buffer`.
 *
 * @param stream The `Readable` stream to convert.
 * @returns A `ResultAsync` that resolves to the `Buffer` on success,
 * or an error on failure.
 */
const streamToBuffer = (
  stream: Readable,
): ResultAsync<Buffer<ArrayBuffer>, ChunkConvertError> =>
  safeTry(async function* () {
    const chunks: Uint8Array[] = [];
    for await (const chunk of stream)
      chunks.push(yield* chunkToUint8Array(chunk));
    return okAsync(Buffer.concat(chunks));
  });

/**
 * Fetch an S3 image and produce a `plaiceholder` blur-placeholder result.
 *
 * @param image The S3 object key, e.g. `"/images/catter-blog/cover.png"`
 * @returns A `ResultAsync` that resolves to the `PlaceholderResult` on success,
 * or an error on failure.
 */
export const getPlaceholder = (
  image: string,
): ResultAsync<PlaceholderResult, PlaceholderError> =>
  getImage(image)
    .andThen(streamToBuffer)
    .andThen((buffer) =>
      ResultAsync.fromPromise(
        getPlaiceholder(buffer),
        (error: unknown): PlaceholderError => ({
          type: "PLACEHOLDER_ERROR",
          message: `Failed to build image placeholder: ${toMessage(error)}`,
        }),
      ),
    );

/**
 * Generates a placeholder image for the given image path in the S3 bucket.
 *
 * @param image The path of the image to generate a placeholder for.
 * @returns An object containing the placeholder image's metadata and base64
 * data and the image URL in the application.
 * @throws {Error} If the placeholder could not be generated.
 * @see {@link getPlaceholder}
 * @note The image must be in the S3 bucket. This function does not accept external images.
 */
export const getImagePlaceholder = async (image: string) => {
  const url = image.startsWith("/") ? `/api${image}` : `/api/${image}`;
  const { metadata, base64 } = await getPlaceholder(image).match(
    (placeholder) => ({
      metadata: placeholder.metadata,
      base64: placeholder.base64 as `data:image/${string}`,
    }),
    (err) => {
      throw new Error(err.message);
    },
  );

  return { metadata, base64, url };
};
