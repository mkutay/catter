import * as Minio from "minio";
import { getPlaiceholder } from "plaiceholder";

export const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT!,
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
});

export const getImage = (url: string) => {
  return minioClient.getObject(process.env.S3_BUCKET_NAME!, url);
};

export const fUploadImage = (url: string, path: string) => {
  const ext = path.split('.').pop();
  const contentType = 'image/' + ext;

  const metadata = {
    'Content-Type': contentType,
    'x-amz-acl': 'public-read',
  }

  return minioClient.fPutObject(process.env.S3_BUCKET_NAME!, url, path, metadata);
};

export const uploadImage = (url: string, buffer: Buffer, size: number, contentType: string) => {
  const metadata = {
    'Content-Type': contentType,
    'x-amz-acl': 'public-read',
  };

  return minioClient.putObject(process.env.S3_BUCKET_NAME!, url, buffer, size, metadata);
}

/**
 * @param image The image url in minio: "/images/catter-blog/cover.png"
 */
export async function getPlaceholder(image: string) {
  const imageStream = await getImage(image);
  const chunks: Uint8Array[] = [];

  for await (const chunk of imageStream) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);
  
  return getPlaiceholder(buffer);
}