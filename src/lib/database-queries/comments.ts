import { desc, eq } from "drizzle-orm";
import { errAsync, okAsync, ResultAsync, safeTry } from "neverthrow";
import type { CommentData, DatabaseError } from "@/config/types";
import { doesPostWithSlugExist } from "@/lib/content-queries";
import { db } from "@/lib/db/drizzle";
import { comments } from "@/lib/db/schema";

export interface GetCommentsError {
  message: string;
  code: "POST_NOT_FOUND" | "DATABASE_ERROR" | "INVALID_SLUG";
}

export interface GetEveryCommentError {
  message: string;
  code: "LIMIT_OUT_OF_RANGE" | "DATABASE_ERROR";
}

export interface GetCommentByIdError {
  message: string;
  code: "COMMENT_NOT_FOUND" | "DATABASE_ERROR";
}

/**
 * Fetches the most recent comments for a specific post.
 *
 * @param slug The unique identifier (slug) of the post.
 * @returns A ResultAsync containing an array of CommentData or a GetCommentsError.
 */
export const getComments = ({
  slug,
}: {
  slug: string;
}): ResultAsync<CommentData[], GetCommentsError> =>
  safeTry(async function* () {
    const postExists = yield* doesPostWithSlugExist(slug);
    if (!postExists) {
      return errAsync({
        message: "Post not found.",
        code: "POST_NOT_FOUND",
      } as GetCommentsError);
    }

    return ResultAsync.fromPromise(
      db
        .select({
          id: comments.id,
          body: comments.body,
          createdBy: comments.createdBy,
          createdAt: comments.createdAt,
          updatedAt: comments.updatedAt,
          email: comments.email,
          slug: comments.slug,
        })
        .from(comments)
        .where(eq(comments.slug, slug))
        .orderBy(desc(comments.createdAt))
        .limit(15),
      () =>
        ({
          message: "Failed to fetch comments. Database error.",
          code: "DATABASE_ERROR",
        }) as GetCommentsError,
    );
  });

/**
 * Fetches all comments across all posts, primarily for administrative use.
 *
 * @param props.limit The maximum number of comments to fetch (1-100, defaults to 15).
 * @returns A ResultAsync containing an array of comments or a GetEveryCommentError.
 */
export const getEveryComment = (props?: { limit: number }) =>
  okAsync(props ? props.limit : 15).andThen((limit) =>
    limit <= 0 || limit > 100
      ? errAsync({
          message: "Limit out of allowed range.",
          code: "LIMIT_OUT_OF_RANGE",
        } as GetEveryCommentError)
      : ResultAsync.fromPromise(
          db
            .select({
              id: comments.id,
              slug: comments.slug,
              body: comments.body,
              createdBy: comments.createdBy,
              createdAt: comments.createdAt,
              updatedAt: comments.updatedAt,
              email: comments.email,
            })
            .from(comments)
            .orderBy(desc(comments.createdAt))
            .limit(limit),
          () =>
            ({
              message: "Failed to fetch comments. Database error.",
              code: "DATABASE_ERROR",
            }) as GetEveryCommentError,
        ),
  );

/**
 * Fetches all comments created by a specific user email.
 *
 * @param email The user's email address.
 * @returns A ResultAsync containing an array of comments or a DatabaseError.
 */
export const getCommentsByEmail = ({ email }: { email: string }) =>
  ResultAsync.fromPromise(
    db
      .select({
        id: comments.id,
        slug: comments.slug,
        body: comments.body,
        createdBy: comments.createdBy,
        createdAt: comments.createdAt,
        updatedAt: comments.updatedAt,
        email: comments.email,
      })
      .from(comments)
      .where(eq(comments.email, email))
      .orderBy(desc(comments.createdAt)),
    () =>
      ({
        message: "Failed to fetch comments. Database error.",
        code: "DATABASE_ERROR",
      }) as DatabaseError,
  );

/**
 * Fetches a single comment by its unique ID.
 *
 * @param id The numeric ID of the comment.
 * @returns A ResultAsync containing the CommentData or a GetCommentByIdError.
 */
export const getCommentById = ({ id }: { id: number }) =>
  ResultAsync.fromPromise(
    db
      .select({
        id: comments.id,
        slug: comments.slug,
        body: comments.body,
        createdBy: comments.createdBy,
        createdAt: comments.createdAt,
        updatedAt: comments.updatedAt,
        email: comments.email,
      })
      .from(comments)
      .where(eq(comments.id, id))
      .limit(1),
    () =>
      ({
        message: "Failed to fetch comment. Database error.",
        code: "DATABASE_ERROR",
      }) as GetCommentByIdError,
  ).andThen((results) =>
    results.length === 0
      ? errAsync({
          message: "Comment not found.",
          code: "COMMENT_NOT_FOUND",
        } as GetCommentByIdError)
      : okAsync(results[0] as CommentData),
  );
