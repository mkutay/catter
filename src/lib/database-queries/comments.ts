import { desc, eq } from "drizzle-orm";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import type { CommentData } from "@/config/types";
import type { DatabaseError } from "@/lib/database-errors";
import { db } from "@/lib/db/drizzle";
import { comments } from "@/lib/db/schema";
import { doesPostWithSlugExist } from "@/lib/dbContentQueries";

interface GetCommentsError {
  message: string;
  code: "POST_NOT_FOUND" | "DATABASE_ERROR" | "INVALID_SLUG";
}

interface GetEveryCommentError {
  message: string;
  code: "LIMIT_OUT_OF_RANGE" | "DATABASE_ERROR";
}

interface GetCommentByIdError {
  message: string;
  code: "COMMENT_NOT_FOUND" | "DATABASE_ERROR";
}

/* Limiting to 15 to avoid loading too many comments at once. */
export const getComments = ({ slug }: { slug: string }) =>
  okAsync(slug)
    .andThen((s) => {
      // Basic validation: slug should be alphanumeric with hyphens, maybe underscores
      const isValid = /^[a-zA-Z0-9_-]+$/.test(s) && s.length <= 200;
      return isValid
        ? okAsync(s)
        : errAsync({
            message: "Invalid slug format.",
            code: "INVALID_SLUG",
          } as GetCommentsError);
    })
    .andThen(() => doesPostWithSlugExist(slug))
    .mapErr(
      (err) =>
        ({
          message: err.message,
          code: err.code === "INVALID_SLUG" ? "INVALID_SLUG" : "POST_NOT_FOUND",
        }) as GetCommentsError,
    )
    .andThen((exists) =>
      !exists
        ? errAsync({
            message: "Post not found.",
            code: "POST_NOT_FOUND",
          } as GetCommentsError)
        : ResultAsync.fromPromise(
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
          ).map((comments): CommentData[] => comments),
    );

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
