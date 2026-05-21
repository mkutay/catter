import Redis from "ioredis";
import { env } from "@/env";

/**
 * Reuse the same connection in development (HMR safe via globalThis).
 */
const globalForRedis = globalThis as { redis?: Redis };

/**
 * A singleton Redis client instance. In development, this will be reused across
 * hot module reloads to avoid creating multiple connections. In production, a
 * new instance will be created on each import, which is fine since the module
 * will only be loaded once.
 */
export const redis =
  globalForRedis.redis ?? new Redis(env.REDIS_URL, { lazyConnect: false });

if (env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}
