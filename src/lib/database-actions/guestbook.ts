import { inArray } from "drizzle-orm";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { revalidatePath } from "next/cache";
import {
  guestbookDialogFormSchema,
  guestbookFormSchema,
} from "@/config/schema";
import { siteConfig } from "@/config/site";
import { type GuestbookColorsType, guestbookColors } from "@/config/types";
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
      session.user?.email
        ? okAsync({
            email: session.user.email,
            name: session.user.name || "Anonymous",
          })
        : errAsync({
            message: "Session not found or email missing. Unauthorized.",
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

      let validColor = "text";
      if (
        validationPopOver.success &&
        color &&
        guestbookColors.includes(color as GuestbookColorsType)
      ) {
        validColor = color;
      }

      return okAsync({
        email,
        createdBy,
        validColor,
      });
    })
    .andThen(({ email, createdBy, validColor }) =>
      getGuestbookEntriesByEmail({ email })
        .andThen((entries) =>
          entries.length > 0 &&
          Date.now() - new Date(entries[0].createdAt).getTime() < 1000 * 15
            ? errAsync({
                message:
                  "Rate limit exceeded. Please wait before submitting again.",
                code: "RATE_LIMIT",
              } as SaveGuestbookEntryError)
            : okAsync(),
        )
        .andThen(() =>
          insertIntoGuestbook(email, message, createdBy, validColor),
        ),
    )
    .andThen(() => {
      revalidatePath("/guestbook");
      revalidatePath("/admin");
      return okAsync();
    });

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

export const deleteGuestbookEntries = ({ entries }: { entries: number[] }) =>
  getAuth()
    .andThen((session) =>
      session.user?.email
        ? okAsync(session.user.email)
        : errAsync({
            message: "User not found or email missing. Unauthorized.",
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
    () =>
      ({
        message: "Failed to delete guestbook entry. Database error.",
        code: "DATABASE_ERROR",
      }) as DatabaseError,
  );
