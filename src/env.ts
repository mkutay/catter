import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    SPOTIFY_OAUTH_CLIENT_SECRET: z.string(),
    SPOTIFY_OAUTH_CLIENT_ID: z.string(),
    DISCORD_OAUTH_CLIENT_SECRET: z.string(),
    DISCORD_OAUTH_CLIENT_ID: z.string(),
    GITHUB_OAUTH_CLIENT_SECRET: z.string(),
    GITHUB_OAUTH_CLIENT_ID: z.string(),
    POSTGRES_URL: z.url(),
    AUTH_SECRET: z.string(),
    AUTH_REDIRECT_PROXY_URL: z.url(),
    MINIO_ENDPOINT: z.string(),
    MINIO_ACCESS_KEY: z.string(),
    MINIO_SECRET_KEY: z.string(),
    MINIO_REGION: z.string(),
    S3_BUCKET_NAME: z.string(),
    SITE_URL: z.url(),
    UPLOAD_API_KEY: z.string(),
  },
  client: {},
  // If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
  experimental__runtimeEnv: {},
  // For Next.js >= 13.4.4, you only need to destructure client variables:
  // experimental__runtimeEnv: {
  //   NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
  // }
});
