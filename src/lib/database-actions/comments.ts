import { eq } from "drizzle-orm";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { commentsFormSchema } from "@/config/schema";
import { siteConfig } from "@/config/site";
import type { DatabaseError } from "@/lib/database-errors";
import { getAuth } from "@/lib/database-queries/auth";
import {
  getCommentById,
  getCommentsByEmail,
} from "@/lib/database-queries/comments";
import { db } from "@/lib/db/drizzle";
import { comments } from "@/lib/db/schema";
import { doesPostWithSlugExist } from "@/lib/dbContentQueries";
import { parseSchema } from "@/lib/utils";

interface SaveCommentError {
  message: string;
  code: "UNAUTHORISED" | "INVALID_SLUG" | "RATE_LIMIT";
}

interface DeleteCommentError {
  message: string;
  code: "UNAUTHORISED" | "DATABASE_ERROR" | "COMMENT_NOT_FOUND";
}

export const saveComment = ({
  slug,
  message,
}: {
  slug: string;
  message: string;
}) =>
  parseSchema(commentsFormSchema, { message })
    .asyncAndThen(() =>
      doesPostWithSlugExist(slug).mapErr(
        () =>
          ({
            message: "Error checking post existence.",
            code: "INVALID_SLUG",
          }) as SaveCommentError,
      ),
    )
    .andThen((exists) =>
      exists
        ? okAsync()
        : errAsync({
            message: "Post not found.",
            code: "INVALID_SLUG",
          } as SaveCommentError),
    )
    .andThen(getAuth)
    .andThen((session) =>
      !session.user || !session.user.email
        ? errAsync({
            message: "Session not found or email missing.",
            code: "UNAUTHORISED",
          } as SaveCommentError)
        : okAsync({
            email: session.user.email,
            name: session.user.name || "Anonymous",
          }),
    )
    .andThen((user) =>
      getCommentsByEmail({ email: user.email }).andThen((commentsList) =>
        // 5 minutes rate limit
        commentsList.length > 0 &&
        Date.now() - new Date(commentsList[0].createdAt).getTime() <
          1000 * 60 * 5
          ? errAsync({
              message:
                "Rate limit exceeded. Please wait before submitting again.",
              code: "RATE_LIMIT",
            } as SaveCommentError)
          : okAsync(user),
      ),
    )
    .andThen(({ email, name }) =>
      insertIntoComments(slug, email, message, name),
    );

export const deleteComment = ({ id }: { id: number }) =>
  getAuth()
    .andThen((session) =>
      !session.user || !session.user.email
        ? errAsync({
            message: "Session not found or email missing.",
            code: "UNAUTHORISED",
          } as DeleteCommentError)
        : okAsync(session.user.email),
    )
    .andThen((sessionEmail) =>
      getCommentById({ id })
        .mapErr(
          (err) =>
            ({
              message: err.message,
              code:
                err.code === "COMMENT_NOT_FOUND"
                  ? "COMMENT_NOT_FOUND"
                  : "DATABASE_ERROR",
            }) as DeleteCommentError,
        )
        .andThen((dbComment) =>
          !siteConfig.admins.includes(sessionEmail) &&
          dbComment.email !== sessionEmail
            ? errAsync({
                message: "You are not authorized to delete this comment.",
                code: "UNAUTHORISED",
              } as DeleteCommentError)
            : okAsync(),
        ),
    )
    .andThen(() => deleteFromComments(id));

const deleteFromComments = (id: number): ResultAsync<void, DatabaseError> =>
  ResultAsync.fromPromise(
    db.delete(comments).where(eq(comments.id, id)).returning(),
    () => ({
      message: "Failed to delete comment. Database error.",
      code: "DATABASE_ERROR" as const,
    }),
  ).andThen(() => okAsync());

const insertIntoComments = (
  slug: string,
  email: string,
  message: string,
  createdBy: string,
) =>
  ResultAsync.fromPromise(
    db
      .insert(comments)
      .values({
        slug,
        email,
        body: message,
        createdBy,
        createdAt: new Date().toISOString(),
      })
      .returning(),
    () =>
      ({
        message: "Failed to save comment. Database error.",
        code: "DATABASE_ERROR",
      }) as DatabaseError,
  );
