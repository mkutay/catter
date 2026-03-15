import type { Readable } from "node:stream";
import * as Minio from "minio";
import { ResultAsync } from "neverthrow";
import { getPlaiceholder } from "plaiceholder";
import { env } from "@/env";

export const minioClient = new Minio.Client({
  endPoint: env.MINIO_ENDPOINT,
  accessKey: env.MINIO_ACCESS_KEY,
  secretKey: env.MINIO_SECRET_KEY,
  useSSL: true, // Enable SSL if using HTTPS
  region: env.MINIO_REGION,
  partSize: 5 * 1024 * 1024, // 5MB part size for multipart uploads
});

// S3 object keys must not start with a leading slash or signatures will break.
const normalizeKey = (key: string) => key.replace(/^\/+/, "");

type ErrorBase<T extends string> = {
  type: T;
  message: string;
};

export type GetImageError = ErrorBase<"GET_IMAGE_ERROR">;

export type UploadImageError = ErrorBase<"UPLOAD_FAIL">;

export type PlaceholderError =
  | ErrorBase<"GET_IMAGE_ERROR">
  | ErrorBase<"IMAGE_STREAM_ERROR">
  | ErrorBase<"PLACEHOLDER_ERROR">;

export type PlaceholderResult = Awaited<ReturnType<typeof getPlaiceholder>>;

const toMessage = (error: unknown, fallback: string): string =>
  error instanceof Error ? error.message : fallback;

const toGetImageError = (error: unknown): GetImageError => ({
  type: "GET_IMAGE_ERROR",
  message: `Failed to get image from S3: ${toMessage(error, "Unknown error.")}`,
});

const toUploadError = (error: unknown): UploadImageError => ({
  type: "UPLOAD_FAIL",
  message: `Upload failed: ${toMessage(error, "Unknown error.")}`,
});

const toImageStreamError = (error: unknown): PlaceholderError => ({
  type: "IMAGE_STREAM_ERROR",
  message: `Failed to read image stream: ${toMessage(error, "Unknown error.")}`,
});

const toPlaceholderError = (error: unknown): PlaceholderError => ({
  type: "PLACEHOLDER_ERROR",
  message: `Failed to build image placeholder: ${toMessage(error, "Unknown error.")}`,
});

export const getImageResult = (
  url: string,
): ResultAsync<Readable, GetImageError> =>
  ResultAsync.fromPromise(
    minioClient.getObject(env.S3_BUCKET_NAME, normalizeKey(url)),
    toGetImageError,
  );

// Backward-compatible wrapper for existing call sites.
export const getImage = async (url: string): Promise<Readable> => {
  const result = await getImageResult(url);

  if (result.isErr()) {
    throw new Error(result.error.message);
  }

  return result.value;
};

export const uploadImageResult = (
  url: string,
  buffer: Buffer,
  size: number,
  contentType: string,
): ResultAsync<void, UploadImageError> => {
  const metadata = {
    "Content-Type": contentType,
    "x-amz-acl": "public-read",
  };

  return ResultAsync.fromPromise(
    minioClient.putObject(
      env.S3_BUCKET_NAME,
      normalizeKey(url),
      buffer,
      size,
      metadata,
    ),
    toUploadError,
  ).map(() => undefined);
};

export const uploadImage = async (
  url: string,
  buffer: Buffer,
  size: number,
  contentType: string,
): Promise<void> => {
  const result = await uploadImageResult(url, buffer, size, contentType);

  if (result.isErr()) {
    throw new Error(result.error.message);
  }
};

const streamToBufferResult = (
  stream: Readable,
): ResultAsync<Buffer, PlaceholderError> =>
  ResultAsync.fromPromise(
    (async () => {
      const chunks: Uint8Array[] = [];

      for await (const chunk of stream) {
        if (typeof chunk === "string") {
          chunks.push(Buffer.from(chunk));
          continue;
        }

        if (chunk instanceof Uint8Array) {
          chunks.push(chunk);
          continue;
        }

        if (ArrayBuffer.isView(chunk)) {
          chunks.push(
            new Uint8Array(chunk.buffer, chunk.byteOffset, chunk.byteLength),
          );
          continue;
        }

        if (chunk instanceof ArrayBuffer) {
          chunks.push(new Uint8Array(chunk));
          continue;
        }

        throw new TypeError("Unsupported stream chunk while reading image.");
      }

      return Buffer.concat(chunks);
    })(),
    toImageStreamError,
  );

export const getPlaceholderResult = (
  image: string,
): ResultAsync<PlaceholderResult, PlaceholderError> =>
  getImageResult(image)
    .mapErr(
      (error): PlaceholderError => ({
        type: error.type,
        message: error.message,
      }),
    )
    .andThen(streamToBufferResult)
    .andThen((buffer) =>
      ResultAsync.fromPromise(getPlaiceholder(buffer), toPlaceholderError),
    );

/**
 * @param image The image url in minio: "/images/catter-blog/cover.png"
 */
export async function getPlaceholder(
  image: string,
): Promise<PlaceholderResult> {
  const result = await getPlaceholderResult(image);

  if (result.isErr()) {
    throw new Error(result.error.message);
  }

  return result.value;
}
