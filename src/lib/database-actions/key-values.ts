import { errAsync, okAsync, ResultAsync, safeTry } from "neverthrow";
import { revalidatePath } from "next/cache";
import { updateKeyValueFormSchema } from "@/config/schema";
import { existingKeys, siteConfig } from "@/config/site";
import type { DatabaseError } from "@/config/types";
import { getAuth } from "@/lib/database-queries/auth";
import { db } from "@/lib/db/drizzle";
import { keyValues } from "@/lib/db/schema";
import { parseSchema } from "@/lib/utils";

export interface UpdateKeyValueError {
  message: string;
  code: "UNAUTHORISED" | "INVALID_KEY" | "DATABASE_ERROR";
}

/**
 * Updates a key-value pair.
 *
 * Requires admin privileges.
 */
export const updateKeyValue = ({
  key,
  value,
}: {
  key: (typeof existingKeys)[number];
  value: string;
}) =>
  safeTry(async function* () {
    yield* parseSchema(updateKeyValueFormSchema, { value });

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

    yield* upsertKeyValue({ key, value });

    revalidatePath("/");
    revalidatePath("/admin");

    return okAsync();
  });

const upsertKeyValue = ({
  key,
  value,
}: {
  key: (typeof existingKeys)[number];
  value: string;
}) =>
  ResultAsync.fromPromise(
    db
      .insert(keyValues)
      .values({ key, value })
      .onConflictDoUpdate({
        target: keyValues.key,
        set: { value },
      })
      .returning(),
    () =>
      ({
        message: "Failed to update key value. Database error.",
        code: "DATABASE_ERROR",
      }) as DatabaseError,
  ).andThen(() => okAsync());
