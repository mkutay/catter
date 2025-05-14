import * as Minio from "minio";

export const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT!,
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
});

export const getImage = async (url: string) => {
  const image = await minioClient.getObject(process.env.S3_BUCKET_NAME!, url);
  return image;
};