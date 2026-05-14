import { inArray } from "drizzle-orm";
import { err, errAsync, ok, okAsync, ResultAsync, safeTry } from "neverthrow";
import { revalidatePath } from "next/cache";
import {
  guestbookDialogFormSchema,
  guestbookFormSchema,
} from "@/config/schema";
import { siteConfig } from "@/config/site";
import type { EntryData } from "@/config/types";
import type { DatabaseError } from "@/lib/database-errors";
import { getAuth } from "@/lib/database-queries/auth";
import {
  doesAllEntriesExist,
  getGuestbookEntriesByEmail,
} from "@/lib/database-queries/guestbook";
import { db } from "@/lib/db/drizzle";
import { guestbook } from "@/lib/db/schema";

interface SaveGuestbookEntryError {
  message: string;
  code: "VALIDATION_ERROR" | "UNAUTHORISED" | "RATE_LIMIT";
}

interface DeleteGuestbookEntriesError {
  message: string;
  code: "UNAUTHORISED" | "NOT_ALL_ENTRIES_EXIST" | "DATABASE_ERROR";
}

/**
 * Saves a new guestbook entry.
 *
 * Handles authentication, validation, rate limiting, and database insertion.
 *
 * @param props.color The display color for the entry's creator name.
 * @param props.username The name to display for the entry. Defaults to the user's session name.
 * @param props.message The content of the guestbook entry.
 * @returns ResultAsync indicating success or containing an error.
 */
export const saveGuestbookEntryData = ({
  color,
  username,
  message,
}: {
  color?: string;
  username?: string;
  message: string;
}) =>
  safeTry(async function* () {
    const session = yield* getAuth();
    const email = session.user?.email;
    const name = session.user?.name ?? "Anonymous";
    if (!email) {
      return errAsync({
        message: "Session not found or email missing. Unauthorized.",
        code: "UNAUTHORISED",
      } as SaveGuestbookEntryError);
    }

    const entries = yield* getGuestbookEntriesByEmail({ email });

    if (isRateLimited(entries, 1000 * 15))
      return errAsync({
        message: "Rate limit exceeded. Please wait before submitting again.",
        code: "RATE_LIMIT",
      } as SaveGuestbookEntryError);

    const parsed = yield* validateInsert({
      color,
      username,
      message,
      name,
    });

    yield* insertIntoGuestbook(
      email,
      parsed.message,
      parsed.createdBy,
      parsed.validColour,
    );

    revalidatePath("/guestbook");
    revalidatePath("/admin");

    return okAsync();
  });

/**
 * Validate inputs using both possible schemas (dialog vs inline form).
 *
 * @param props.color The color of the entry.
 * @param props.username The username of the entry.
 * @param props.message The message of the entry.
 * @param props.name The name of the entry.
 * @returns A Result containing the validated guestbook entry or an error.
 */
const validateInsert = ({
  color,
  username,
  message,
  name,
}: {
  color?: string;
  username?: string;
  message: string;
  name: string;
}) => {
  const dialogValidation = guestbookDialogFormSchema.safeParse({
    color,
    message,
    username,
  });

  const inlineValidation = guestbookFormSchema.safeParse({
    message,
  });

  if (!dialogValidation.success && !inlineValidation.success) {
    const error = `${dialogValidation.error?.message} ${inlineValidation.error?.message}`;
    return err({
      message: `Validation error: ${error}`,
      code: "VALIDATION_ERROR",
    } as SaveGuestbookEntryError);
  }

  const createdBy = dialogValidation.success && username ? username : name;
  const validColour = dialogValidation.success
    ? dialogValidation.data.color
    : "text";

  return ok({
    createdBy,
    validColour,
    message,
  });
};

/**
 * Checks if the user is rate limited based on their guestbook entries.
 *
 * @param entries The user's guestbook entries.
 * @param time The rate limit in milliseconds.
 * @returns `true` if the user is rate limited, `false` otherwise.
 */
const isRateLimited = (entries: EntryData[], time: number): boolean => {
  const newestEntry = entries.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )[0];

  return (
    newestEntry && Date.now() - new Date(newestEntry.createdAt).getTime() < time
  );
};

/**
 * Inserts a guestbook entry into the database.
 */
const insertIntoGuestbook = (
  email: string,
  message: string,
  created_by: string,
  color: string,
) =>
  ResultAsync.fromPromise(
    db
      .insert(guestbook)
      .values({
        email,
        body: message,
        createdBy: created_by,
        createdAt: new Date().toISOString(),
        color,
      })
      .returning(),
    () =>
      ({
        message: "Failed to insert guestbook entry. Database error.",
        code: "DATABASE_ERROR",
      }) as DatabaseError,
  );

/**
 * Deletes multiple guestbook entries.
 *
 * Requires admin privileges.
 *
 * @param props.entries Array of guestbook entry IDs to delete.
 * @returns ResultAsync indicating success or containing an error.
 */
export const deleteGuestbookEntries = ({ entries }: { entries: number[] }) =>
  safeTry(async function* () {
    const session = yield* getAuth();
    const sessionEmail = session.user?.email;
    if (!sessionEmail || !siteConfig.admins.includes(sessionEmail)) {
      return errAsync({
        message: "Not an admin. Unauthorised.",
        code: "UNAUTHORISED",
      } as DeleteGuestbookEntriesError);
    }

    const entriesExist = yield* doesAllEntriesExist({ ids: entries });
    if (!entriesExist) {
      return errAsync({
        message: "Not all entries exist. Not performing.",
        code: "NOT_ALL_ENTRIES_EXIST",
      } as DeleteGuestbookEntriesError);
    }

    yield* deleteFromGuestbook(entries);
    revalidatePath("/admin");
    revalidatePath("/guestbook");
    return okAsync();
  });

/**
 * Deletes guestbook entries from the database by their IDs.
 */
const deleteFromGuestbook = (entries: number[]) =>
  ResultAsync.fromPromise(
    db.delete(guestbook).where(inArray(guestbook.id, entries)).returning(),
    () =>
      ({
        message: "Failed to delete guestbook entry. Database error.",
        code: "DATABASE_ERROR",
      }) as DatabaseError,
  );
