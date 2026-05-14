import "@testing-library/jest-dom";
import { vi } from "vitest";

vi.mock("@/env", () => ({
  env: {
    SPOTIFY_OAUTH_CLIENT_SECRET: "mock",
    SPOTIFY_OAUTH_CLIENT_ID: "mock",
    DISCORD_OAUTH_CLIENT_SECRET: "mock",
    DISCORD_OAUTH_CLIENT_ID: "mock",
    GITHUB_OAUTH_CLIENT_SECRET: "mock",
    GITHUB_OAUTH_CLIENT_ID: "mock",
    POSTGRES_URL: "postgres://localhost:5432/db",
    AUTH_SECRET: "mock",
    AUTH_REDIRECT_PROXY_URL: "https://localhost:3000",
    MINIO_ENDPOINT: "localhost",
    MINIO_ACCESS_KEY: "mock",
    MINIO_SECRET_KEY: "mock",
    MINIO_REGION: "us-east-1",
    S3_BUCKET_NAME: "mock-bucket",
    SITE_URL: "https://localhost:3000",
    UPLOAD_API_KEY: "mock",
  },
}));
