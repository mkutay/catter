import type { Readable } from "node:stream";
import * as Minio from "minio";
import {
  err,
  errAsync,
  fromThrowable,
  ok,
  okAsync,
  type Result,
  ResultAsync,
  safeTry,
} from "neverthrow";
import { getPlaiceholder } from "plaiceholder";
import { env } from "@/env";
import { getKeyValues, upsertKeyValue } from "./database-actions/key-values";

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

type Base64 = `data:image/${string};base64,${string}`;

export type PlaceholderCacheError = ErrorBase<"PLACEHOLDER_CACHE_ERROR">;
export type PlaceholderResult = Awaited<ReturnType<typeof getPlaiceholder>>;
type PlaceholderCacheValue = {
  metadata: {
    width: PlaceholderResult["metadata"]["width"];
    height: PlaceholderResult["metadata"]["height"];
    format: PlaceholderResult["metadata"]["format"];
    orientation: PlaceholderResult["metadata"]["orientation"];
    size: PlaceholderResult["metadata"]["size"];
  };
  base64: Base64;
  url: string;
  createdAt: string;
};

/** S3 object keys must not start with a leading slash or request signatures break. */
const normalizeKey = (key: string) => key.replace(/^\/+/, "");

/** Get the cache key for placeholder result from `url`. */
const getPlaceholderCacheKey = (url: string) => `image-placeholder:${url}`;

/**
 * Parses a JSON string into a `PlaceholderCacheValue`, returning a
 * structured error if parsing fails.
 *
 * @param value The JSON string to parse.
 * @returns A `Result` containing the parsed `PlaceholderCacheValue`
 * or a `PlaceholderCacheError`.
 * @note We trust the data in the cache to be correctly formatted.
 */
const parsePlaceholderCacheValue = (value: string) =>
  fromThrowable(
    (): PlaceholderCacheValue => JSON.parse(value),
    (err): PlaceholderCacheError => ({
      type: "PLACEHOLDER_CACHE_ERROR",
      message: `Failed to parse placeholder cache value: ${toMessage(err)}`,
    }),
  )();

/**
 * Fetches a cached placeholder from the database for the given cache key.
 *
 * @param cacheKey The key to look up in the cache.
 * @returns A `ResultAsync` containing the cached `PlaceholderCacheValue`
 * or an error if the cache entry is missing, malformed, if multiple
 * entries are returned, or if the cache entry is stale.
 * @note Cache entries are considered stale if they are older than 48 hours.
 */
const getCachedPlaceholder = (cacheKey: string) =>
  getKeyValues([cacheKey])
    .andThen((entries) =>
      entries.length !== 1
        ? errAsync({
            type: "PLACEHOLDER_CACHE_ERROR",
            message: "Unexpected number of cache entries returned.",
          } as PlaceholderCacheError)
        : okAsync(entries[0]),
    )
    .andThen(({ value }) => parsePlaceholderCacheValue(value))
    .andThen((value) =>
      // Only return the cache entry if it's less than 48 hours old.
      new Date(value.createdAt) > new Date(Date.now() - 48 * 60 * 60 * 1000)
        ? okAsync(value)
        : errAsync({
            type: "PLACEHOLDER_CACHE_ERROR",
            message: "Cache entry is stale.",
          } as PlaceholderCacheError),
    );

/**
 * Generates a placeholder for the given image and stores it in the cache.
 *
 * The cache entry includes the placeholder metadata, base64 data, the
 * image URL, and the creation timestamp.
 *
 * @param cacheKey The key under which to store the cache entry.
 * @param image The S3 object key of the image to generate a placeholder
 * for, e.g., `"/images/catter-blog/cover.png"`.
 * @param url The URL of the image in the application, e.g.,
 * `"/api/images/catter-blog/cover.png"`.
 * @returns A `ResultAsync` that resolves to the cached `PlaceholderCacheValue`
 * on success, or an error on failure.
 */
const setPlaceholderCache = (
  cacheKey: string,
  image: string,
  url: string,
): ResultAsync<PlaceholderCacheValue, PlaceholderError> =>
  getPlaceholder(image)
    .map(
      (plc): PlaceholderCacheValue => ({
        metadata: {
          width: plc.metadata.width,
          height: plc.metadata.height,
          format: plc.metadata.format,
          orientation: plc.metadata.orientation,
          size: plc.metadata.size,
        },
        base64: plc.base64 as Base64,
        url,
        createdAt: new Date().toISOString(),
      }),
    )
    .andTee((value) =>
      upsertKeyValue({ key: cacheKey, value: JSON.stringify(value) }),
    );

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
export const getImagePlaceholder = async (
  image: string,
): Promise<PlaceholderCacheValue> => {
  const url = image.startsWith("/") ? `/api${image}` : `/api/${image}`;
  const cacheKey = getPlaceholderCacheKey(url);

  return await getCachedPlaceholder(cacheKey)
    .orElse(() => setPlaceholderCache(cacheKey, image, url))
    .match(
      (value) => value,
      (err) => {
        throw new Error(err.message);
      },
    );
};
