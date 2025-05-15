import * as Minio from "minio";

export const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT!,
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
});

export const getImage = (url: string) => {
  return minioClient.getObject(process.env.S3_BUCKET_NAME!, url);
};

export const fUploadImage = async (url: string, path: string) => {
  const ext = path.split('.').pop();
  const contentType = 'image/' + ext;

  const metadata = {
    'Content-Type': contentType,
    'x-amz-acl': 'public-read',
  }

  await minioClient.fPutObject(process.env.S3_BUCKET_NAME!, url, path, metadata);
  console.log(`Successfully uploaded ${url} to minio`);
};

export const uploadImage = (url: string, buffer: Buffer, size: number, contentType: string) => {
  const metadata = {
    'Content-Type': contentType,
    'x-amz-acl': 'public-read',
  };

  return minioClient.putObject(process.env.S3_BUCKET_NAME!, url, buffer, size, metadata);
}