import { errAsync, okAsync, ResultAsync, safeTry } from "neverthrow";
import { revalidatePath } from "next/cache";
import { existingKeys, siteConfig } from "@/config/site";
import type { DatabaseError } from "@/config/types";
import { getAuth } from "@/lib/database-queries/auth";
import { db } from "@/lib/db/drizzle";
import { keyValues } from "@/lib/db/schema";
import { doesPostWithSlugExist } from "../content-queries";

export interface UpdateKeyValueError {
  message: string;
  code: "UNAUTHORISED" | "INVALID_KEY" | "DATABASE_ERROR" | "INVALID_SLUG";
}

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
 * Inserts or updates a key-value pair in the database.
 *
 * @param key The key to insert or update.
 * @param value The value to associate with the key.
 * @returns A `ResultAsync` containing the inserted or updated
 * key-value pairs, or an error if the operation fails.
 */
export const upsertKeyValue = ({
  key,
  value,
}: {
  key: string;
  value: string;
}): ResultAsync<{ key: string; value: string }[], DatabaseError> =>
  ResultAsync.fromPromise(
    db
      .insert(keyValues)
      .values({ key, value })
      .onConflictDoUpdate({
        target: keyValues.key,
        set: { value },
      })
      .returning({ key: keyValues.key, value: keyValues.value }),
    () =>
      ({
        message: "Failed to update key value. Database error.",
        code: "DATABASE_ERROR",
      }) as DatabaseError,
  );
