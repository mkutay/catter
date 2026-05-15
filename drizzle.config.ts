import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: [".env.local", ".env", ".env.development"] });

const postgresURL = process.env.POSTGRES_URL;

if (!postgresURL) {
  throw new Error("POSTGRES_URL is not defined in the environment variables.");
}

export default defineConfig({
  out: "./migrations",
  schema: "./src/lib/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: postgresURL,
  },
});
