import {
  errAsync,
  fromPromise,
  okAsync,
  type ResultAsync,
  safeTry,
} from "neverthrow";
import { revalidatePath } from "next/cache";
import { existingKeys, siteConfig } from "@/config/site";
import type { DatabaseError } from "@/config/types";
import { getAuth } from "@/lib/database-queries/auth";
import { redis } from "@/lib/redis";
import { doesPostWithSlugExist } from "../content-queries";

export interface UpdateKeyValueError {
  message: string;
  code: "UNAUTHORISED" | "INVALID_KEY" | "DATABASE_ERROR" | "INVALID_SLUG";
}

export interface GetKeyValueError {
  message: string;
  code: "DATABASE_ERROR";
}

type KV = { key: string; value: string };

/**
 * Updates a key-value pair for the homepage configuration.
 *
 * Requires admin privileges.
 *
 * Validates the key against a predefined list and checks if the provided slug exists.
 *
 * @param props.key The key to update (must be in `existingKeys`).
 * @param props.slug The slug of the post to associate with the key.
 * @returns A `ResultAsync` indicating success or containing an error.
 */
export const updateKeyValueHomePage = ({
  key,
  slug,
}: {
  key: (typeof existingKeys)[number];
  slug: string;
}) =>
  safeTry(async function* () {
    const session = yield* getAuth();
    const sessionEmail = session.user?.email;

    if (!sessionEmail || !siteConfig.admins.includes(sessionEmail)) {
      return errAsync({
        message: "Not an admin. Unauthorised.",
        code: "UNAUTHORISED",
      } as UpdateKeyValueError);
    }

    if (!existingKeys.includes(key)) {
      return errAsync({
        message: "Invalid key provided.",
        code: "INVALID_KEY",
      } as UpdateKeyValueError);
    }

    const doesPostExists = yield* doesPostWithSlugExist(slug);
    if (!doesPostExists) {
      return errAsync({
        message: "Provided slug does not exist.",
        code: "INVALID_SLUG",
      } as UpdateKeyValueError);
    }

    yield* upsertKeyValue({ key, value: slug });

    revalidatePath("/");
    revalidatePath("/admin");

    return okAsync();
  });

/**
 * Inserts or updates a key-value pair in Redis with an optional TTL.
 *
 * @param props.key The key to insert or update.
 * @param props.value The value to associate with the key.
 * @param props.ttl Optional time-to-live in seconds for the key-value pair.
 * @returns A `ResultAsync` containing the key-value pair on success,
 * or a `DatabaseError` on failure.
 */
export const upsertKeyValue = ({
  key,
  value,
  ttl,
}: {
  key: string;
  value: string;
  ttl?: number | undefined;
}): ResultAsync<KV, DatabaseError> =>
  fromPromise(
    ttl !== undefined
      ? redis.set(key, value, "EX", ttl)
      : redis.set(key, value),
    (): DatabaseError => ({
      message: "Failed to update key value. Redis error.",
      code: "DATABASE_ERROR",
    }),
  ).map(() => ({ key, value }));

/**
 * Fetches key-value pairs from Redis for the specified keys.
 *
 * @param keys An array of keys to fetch values for.
 * @returns A `ResultAsync` containing an array of key-value pairs,
 * or an error if the operation fails.
 */
export const getKeyValues = (
  keys: readonly string[],
): ResultAsync<KV[], GetKeyValueError> =>
  safeTry(async function* () {
    if (keys.length === 0) {
      return okAsync([]);
    }

    const values = yield* fromPromise(
      redis.mget(...keys),
      (err): GetKeyValueError => ({
        code: "DATABASE_ERROR",
        message:
          "Redis error while fetching key values: " +
          (err instanceof Error ? err.message : String(err)),
      }),
    );

    const keyValuePairs: { key: string; value: string }[] = [];
    for (let i = 0; i < keys.length; i++) {
      const value = values[i];
      if (value !== null) {
        keyValuePairs.push({ key: keys[i], value });
      }
    }

    return okAsync(keyValuePairs);
  });

/**
 * Fetches the value for a single key from Redis.
 *
 * @param key The key to fetch the value for.
 * @returns A `ResultAsync` containing the key-value pair,
 * or an error if the operation fails.
 */
export const getValue = (key: string): ResultAsync<KV, GetKeyValueError> =>
  fromPromise(
    redis.get(key),
    (err): GetKeyValueError => ({
      code: "DATABASE_ERROR",
      message:
        "Redis error while fetching key value: " +
        (err instanceof Error ? err.message : String(err)),
    }),
  ).andThen((value) =>
    value === null
      ? errAsync({
          code: "DATABASE_ERROR",
          message: `Key "${key}" not found in Redis.`,
        } as GetKeyValueError)
      : okAsync({ key, value }),
  );
