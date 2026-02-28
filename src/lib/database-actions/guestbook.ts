import { inArray } from "drizzle-orm";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { revalidatePath } from "next/cache";
import {
  guestbookDialogFormSchema,
  guestbookFormSchema,
} from "@/config/schema";
import { siteConfig } from "@/config/site";
import type { EntryData } from "@/config/types";
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
  code: "UNAUTHORISED" | "NOT_ALL_ENTRIES_EXIST";
}

export const saveGuestbookEntryData = ({
  color,
  username,
  message,
}: {
  color?: string;
  username?: string;
  message: string;
}) =>
  getAuth()
    .andThen((session) =>
      session.user
        ? okAsync({
            email: session.user.email || "",
            name: session.user.name || "",
          })
        : errAsync({
            message: "Session not found. Unauthorized.",
            code: "UNAUTHORISED",
          } as SaveGuestbookEntryError),
    )
    .andThen(({ email, name }) => {
      const validationPopOver = guestbookDialogFormSchema.safeParse({
        color,
        message,
        username,
      });

      const validationGuestbook = guestbookFormSchema.safeParse({
        message,
      });

      if (!validationPopOver.success && !validationGuestbook.success) {
        return errAsync({
          message:
            "Validation error: " +
            validationPopOver.error.message +
            ", " +
            validationGuestbook.error.message,
          code: "VALIDATION_ERROR",
        } as SaveGuestbookEntryError);
      }

      const createdBy = validationPopOver.success ? username || "" : name;

      if (!validationPopOver.success) {
        color = "text";
      }

      return okAsync({
        email,
        createdBy,
      });
    })
    .andThen(({ email, createdBy }) =>
      getGuestbookEntriesByEmail({ email })
        .andThen((entries) =>
          entries.length > 0 &&
          Date.now() - new Date(entries[0].created_at).getTime() < 1000 * 15
            ? errAsync({
                message:
                  "Rate limit exceeded. Please wait before submitting again.",
                code: "RATE_LIMIT",
              } as SaveGuestbookEntryError)
            : okAsync(),
        )
        .andThen(() =>
          insertIntoGuestbook(
            Math.floor(Math.random() * 1000000),
            email,
            message,
            createdBy,
            color || "text",
          ),
        ),
    )
    .andThen(() => {
      revalidatePath("/guestbook");
      revalidatePath("/admin");
      return okAsync();
    });

const insertIntoGuestbook = (
  random: number,
  email: string,
  message: string,
  created_by: string,
  color: string,
) =>
  ResultAsync.fromPromise(
    db
      .insert(guestbook)
      .values({
        id: random,
        email,
        body: message,
        createdBy: created_by,
        createdAt: new Date().toISOString(),
        color,
      })
      .returning(),
    () => ({
      message: "Failed to insert guestbook entry. Database error.",
      code: "DATABASE_ERROR",
    }),
  );

export const deleteGuestbookEntries = ({ entries }: { entries: number[] }) =>
  getAuth()
    .andThen((session) =>
      session.user
        ? okAsync(session.user.email || "")
        : errAsync({
            message: "User not found. Unauthorized.",
            code: "UNAUTHORISED",
          } as DeleteGuestbookEntriesError),
    )
    .andThen((email) =>
      !siteConfig.admins.includes(email)
        ? errAsync({
            message: "Not an admin. Unauthorized.",
            code: "UNAUTHORISED",
          } as DeleteGuestbookEntriesError)
        : okAsync(),
    )
    .andThen(() => doesAllEntriesExist({ ids: entries }))
    .andThen((exists) =>
      exists
        ? okAsync()
        : errAsync({
            message: "Not all entries exist. Not performing.",
            code: "NOT_ALL_ENTRIES_EXIST",
          } as DeleteGuestbookEntriesError),
    )
    .andThen(() => deleteFromGuestbook(entries))
    .andThen(() => {
      revalidatePath("/admin");
      revalidatePath("/guestbook");
      return okAsync();
    });

const deleteFromGuestbook = (entries: number[]) =>
  ResultAsync.fromPromise(
    db.delete(guestbook).where(inArray(guestbook.id, entries)).returning(),
    () => ({
      message: "Failed to delete guestbook entry. Database error.",
      code: "DATABASE_ERROR" as const,
    }),
  );
