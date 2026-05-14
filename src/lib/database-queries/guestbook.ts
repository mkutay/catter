import { desc, eq, inArray } from "drizzle-orm";
import { errAsync, okAsync, ResultAsync, safeTry } from "neverthrow";
import type { DatabaseError } from "@/config/types";
import { db } from "@/lib/db/drizzle";
import { guestbook } from "@/lib/db/schema";

interface GetGuestbookEntriesError {
  message: string;
  code: "LIMIT_OUT_OF_RANGE" | "DATABASE_ERROR";
}

interface DoesAllEntriesExistError {
  message: string;
  code: "NO_IDS_GIVEN" | "DATABASE_ERROR";
}

/**
 * Common selection fields for guestbook entries to ensure consistency across queries.
 */
const GUESTBOOK_ENTRY_SELECT = {
  id: guestbook.id,
  body: guestbook.body,
  createdBy: guestbook.createdBy,
  createdAt: guestbook.createdAt,
  updatedAt: guestbook.updatedAt,
  email: guestbook.email,
  color: guestbook.color,
};

/**
 * Fetches guestbook entries with an optional limit.
 *
 * @param props.limit The maximum number of entries to fetch (1-200, default 100).
 * @returns ResultAsync containing an array of guestbook entries or an error.
 */
export const getGuestbookEntries = (props?: { limit: number }) =>
  safeTry(async function* () {
    const limit = props ? props.limit : 100;
    if (limit <= 0 || limit > 200) {
      return errAsync({
        message: "Limit out of allowed range.",
        code: "LIMIT_OUT_OF_RANGE",
      } as GetGuestbookEntriesError);
    }

    return ResultAsync.fromPromise(
      db
        .select(GUESTBOOK_ENTRY_SELECT)
        .from(guestbook)
        .orderBy(desc(guestbook.createdAt))
        .limit(limit),
      () =>
        ({
          message: "Failed to fetch guestbook entries. Database error.",
          code: "DATABASE_ERROR",
        }) as GetGuestbookEntriesError,
    );
  });

/**
 * Verifies if all provided guestbook entry IDs exist in the database.
 *
 * @param props.ids The array of guestbook entry IDs to check.
 * @returns ResultAsync containing a boolean indicating if all IDs exist.
 */
export const doesAllEntriesExist = ({ ids }: { ids: number[] }) =>
  safeTry(async function* () {
    if (ids.length === 0)
      return errAsync({
        message: "No entries to check.",
        code: "NO_IDS_GIVEN",
      } as DoesAllEntriesExistError);

    const entries = yield* ResultAsync.fromPromise(
      db
        .select({ id: guestbook.id })
        .from(guestbook)
        .where(inArray(guestbook.id, ids)),
      () =>
        ({
          message: "Failed to fetch guestbook entries. Database error.",
          code: "DATABASE_ERROR",
        }) as DoesAllEntriesExistError,
    );

    return okAsync(entries.length === ids.length);
  });

/**
 * Fetches all guestbook entries associated with a specific email address.
 *
 * @param props.email The email address to filter by.
 * @returns ResultAsync containing an array of guestbook entries.
 */
export const getGuestbookEntriesByEmail = ({ email }: { email: string }) =>
  ResultAsync.fromPromise(
    db
      .select(GUESTBOOK_ENTRY_SELECT)
      .from(guestbook)
      .where(eq(guestbook.email, email))
      .orderBy(desc(guestbook.createdAt)),
    () =>
      ({
        message: "Failed to fetch guestbook entries. Database error.",
        code: "DATABASE_ERROR",
      }) as DatabaseError,
  );
