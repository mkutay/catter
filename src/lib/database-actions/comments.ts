import { eq } from "drizzle-orm";
import { errAsync, ResultAsync, safeTry } from "neverthrow";
import { commentsFormSchema } from "@/config/schema";
import { siteConfig } from "@/config/site";
import type { CommentData, DatabaseError } from "@/config/types";
import { getAuth } from "@/lib/database-queries/auth";
import {
  getCommentById,
  getCommentsByEmail,
} from "@/lib/database-queries/comments";
import { db } from "@/lib/db/drizzle";
import { comments } from "@/lib/db/schema";
import { doesPostWithSlugExist } from "@/lib/dbContentQueries";
import { parseSchema } from "@/lib/utils";

export interface SaveCommentError {
  message: string;
  code: "UNAUTHORISED" | "INVALID_SLUG" | "RATE_LIMIT" | "DATABASE_ERROR";
}

export interface DeleteCommentError {
  message: string;
  code: "UNAUTHORISED" | "DATABASE_ERROR" | "COMMENT_NOT_FOUND";
}

/**
 * Saves a new comment to the database.
 *
 * Performs validation on the message and slug, checks for authentication,
 * and enforces a rate limit (5 minutes between comments from the same email).
 *
 * @param props.slug The slug of the post to comment on.
 * @param props.message The content of the comment.
 * @returns A ResultAsync containing the saved comment or an error.
 */
export const saveComment = ({
  slug,
  message,
}: {
  slug: string;
  message: string;
}) =>
  safeTry(async function* () {
    const _parsed = yield* parseSchema(commentsFormSchema, { message });
    const postExists = yield* doesPostWithSlugExist(slug);
    if (!postExists) {
      return errAsync({
        message: "Post not found.",
        code: "INVALID_SLUG",
      } as SaveCommentError);
    }

    const session = yield* getAuth();

    if (!session.user || !session.user.email) {
      return errAsync({
        message: "Session not found or email missing.",
        code: "UNAUTHORISED",
      } as SaveCommentError);
    }

    const comments = yield* getCommentsByEmail({ email: session.user.email });
    if (isRateLimited(comments, 1000 * 60 * 5)) {
      return errAsync({
        message: "Rate limit exceeded. Please wait before submitting again.",
        code: "RATE_LIMIT",
      } as SaveCommentError);
    }

    const name = session.user.name ?? "Anonymous";
    const email = session.user.email;

    return insertIntoComments(slug, email, message, name);
  });

/**
 * Checks if the user is rate limited based on the time since their last comment.
 *
 * @param comments The user's comments.
 * @param time The time in milliseconds to check against the last comment's createdAt timestamp.
 * @returns A boolean indicating whether the user is rate limited.
 */
export const isRateLimited = (
  comments: CommentData[],
  time: number,
): boolean => {
  const newest = comments.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )[0];

  return newest && Date.now() - new Date(newest.createdAt).getTime() < time;
};

/**
 * Deletes a comment from the database.
 *
 * Verifies that the user is authenticated and is either an admin
 * or the author of the comment.
 *
 * @param props.id The numeric ID of the comment to delete.
 * @returns A ResultAsync containing the deleted comment or an error.
 */
export const deleteComment = ({ id }: { id: number }) =>
  safeTry(async function* () {
    const session = yield* getAuth();
    const comment = yield* getCommentById({ id });
    const sessionEmail = session.user?.email;

    if (!sessionEmail) {
      return errAsync({
        message: "Session not found or email missing.",
        code: "UNAUTHORISED",
      } as DeleteCommentError);
    }

    if (
      !siteConfig.admins.includes(sessionEmail) &&
      comment.email !== sessionEmail
    ) {
      return errAsync({
        message: "You are not authorised to delete this comment.",
        code: "UNAUTHORISED",
      } as DeleteCommentError);
    }

    return deleteFromComments(id);
  });

/**
 * Internal helper to delete a comment from the database.
 */
const deleteFromComments = (
  id: number,
): ResultAsync<CommentData[], DatabaseError> =>
  ResultAsync.fromPromise(
    db.delete(comments).where(eq(comments.id, id)).returning(),
    () => ({
      message: "Failed to delete comment. Database error.",
      code: "DATABASE_ERROR" as const,
    }),
  );

/**
 * Internal helper to insert a new comment into the database.
 */
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
      }) as SaveCommentError,
  );
