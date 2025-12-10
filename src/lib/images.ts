import * as Minio from "minio";
import { getPlaiceholder } from "plaiceholder";

export const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT!,
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
  useSSL: true, // Enable SSL if using HTTPS
  region: process.env.MINIO_REGION || 'eu-central',
  partSize: 5 * 1024 * 1024, // 5MB part size for multipart uploads
});

// S3 object keys must not start with a leading slash or signatures will break.
const normalizeKey = (key: string) => key.replace(/^\/+/, '');

export const getImage = (url: string) => {
  return minioClient.getObject(process.env.S3_BUCKET_NAME!, normalizeKey(url));
};

export const fUploadImage = (url: string, path: string) => {
  const ext = path.split('.').pop();
  const contentType = 'image/' + ext;

  const metadata = {
    'Content-Type': contentType,
    'x-amz-acl': 'public-read',
  }

  return minioClient.fPutObject(process.env.S3_BUCKET_NAME!, normalizeKey(url), path, metadata);
};

// Utility function to add timeout to promises
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs)
    )
  ]);
};

export const uploadImage = async (url: string, buffer: Buffer, size: number, contentType: string, retries = 3): Promise<void> => {
  const metadata = {
    'Content-Type': contentType,
    'x-amz-acl': 'public-read',
  };

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // Add 30-second timeout to the upload operation
      await withTimeout(
        minioClient.putObject(process.env.S3_BUCKET_NAME!, normalizeKey(url), buffer, size, metadata),
        30000 // 30 seconds timeout
      );
      return; // Success, exit the function
    } catch (error) {
      const isLastAttempt = attempt === retries;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      console.log(`Upload attempt ${attempt}/${retries} failed for ${url}: ${errorMessage}`);
      
      if (isLastAttempt) {
        throw new Error(`Failed to upload ${url} after ${retries} attempts: ${errorMessage}`);
      }
      
      // Wait before retrying (exponential backoff)
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000); // Max 10 seconds
      console.log(`Retrying upload for ${url} in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
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