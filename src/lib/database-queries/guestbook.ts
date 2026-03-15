import { desc, eq, inArray } from "drizzle-orm";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import type { EntryData } from "@/config/types";
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

export const getGuestbookEntries = (props?: { limit: number }) =>
  okAsync(props ? props.limit : 100).andThen((limit) =>
    limit <= 0 || limit > 200
      ? errAsync({
          message: "Limit out of allowed range.",
          code: "LIMIT_OUT_OF_RANGE",
        } as GetGuestbookEntriesError)
      : ResultAsync.fromPromise(
          db
            .select({
              id: guestbook.id,
              body: guestbook.body,
              createdBy: guestbook.createdBy,
              createdAt: guestbook.createdAt,
              updatedAt: guestbook.updatedAt,
              email: guestbook.email,
              color: guestbook.color,
            })
            .from(guestbook)
            .orderBy(desc(guestbook.createdAt))
            .limit(limit),
          () =>
            ({
              message: "Failed to fetch guestbook entries. Database error.",
              code: "DATABASE_ERROR",
            }) as GetGuestbookEntriesError,
        ).map((entries) => entries as EntryData[]),
  );

export const doesAllEntriesExist = ({ ids }: { ids: number[] }) =>
  ids.length === 0
    ? errAsync({
        message: "No entries to check.",
        code: "NO_IDS_GIVEN",
      } as DoesAllEntriesExistError)
    : ResultAsync.fromPromise(
        db
          .select({ id: guestbook.id })
          .from(guestbook)
          .where(inArray(guestbook.id, ids)),
        () =>
          ({
            message: "Failed to fetch guestbook entries. Database error.",
            code: "DATABASE_ERROR",
          }) as DoesAllEntriesExistError,
      ).andThen((result) => okAsync(result.length === ids.length));

export const getGuestbookEntriesByEmail = ({ email }: { email: string }) =>
  ResultAsync.fromPromise(
    db
      .select({
        id: guestbook.id,
        body: guestbook.body,
        created_by: guestbook.createdBy,
        created_at: guestbook.createdAt,
        updated_at: guestbook.updatedAt,
        email: guestbook.email,
        color: guestbook.color,
      })
      .from(guestbook)
      .where(eq(guestbook.email, email))
      .orderBy(desc(guestbook.createdAt)),
    () => ({
      message: "Failed to fetch guestbook entries. Database error.",
      code: "DATABASE_ERROR" as const,
    }),
  );
