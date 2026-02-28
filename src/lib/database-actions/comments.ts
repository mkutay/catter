import { eq } from "drizzle-orm";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { commentsFormSchema } from "@/config/schema";
import { siteConfig } from "@/config/site";
import type { CommentData } from "@/config/types";
import { getAuth } from "@/lib/database-queries/auth";
import { getCommentsByEmail } from "@/lib/database-queries/comments";
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
  code: "UNAUTHORISED" | "DATABASE_ERROR";
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
      ResultAsync.fromPromise(
        doesPostWithSlugExist(slug),
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
    .andThen(() => getAuth())
    .andThen((session) =>
      !session || !session.user
        ? errAsync({
            message: "Session not found.",
            code: "UNAUTHORISED",
          } as SaveCommentError)
        : okAsync({
            email: session.user.email || "",
            name: session.user.name || "",
          }),
    )
    .andThen(({ email, name }) =>
      getCommentsByEmail({ email })
        .andThen((comments) =>
          // 5 minutes rate limit
          comments.length > 0 &&
          Date.now() - new Date(comments[0].created_at).getTime() <
            1000 * 60 * 5
            ? errAsync({
                message:
                  "Rate limit exceeded. Please wait before submitting again.",
                code: "RATE_LIMIT",
              } as SaveCommentError)
            : okAsync(),
        )
        .andThen(() =>
          insertIntoComments(
            Math.floor(Math.random() * 10000000),
            slug,
            email,
            message,
            name,
          ),
        ),
    );

export const deleteComment = ({ comment }: { comment: CommentData }) =>
  getAuth()
    .andThen((session) =>
      !session.user
        ? errAsync({
            message: "Session not found.",
            code: "UNAUTHORISED",
          } as DeleteCommentError)
        : okAsync(session.user.email || ""),
    )
    .andThen((email) =>
      !siteConfig.admins.includes(email) && comment.email !== email
        ? errAsync({
            message: "You are not authorized to delete this comment.",
            code: "UNAUTHORISED",
          } as DeleteCommentError)
        : okAsync(),
    )
    .andThen(() => deleteFromComments(comment.id));

const deleteFromComments = (id: number) =>
  ResultAsync.fromPromise(
    db.delete(comments).where(eq(comments.id, id)).returning(),
    () => ({
      message: "Failed to delete comment. Database error.",
      code: "DATABASE_ERROR" as const,
    }),
  );

const insertIntoComments = (
  random: number,
  slug: string,
  email: string,
  message: string,
  created_by: string,
) =>
  ResultAsync.fromPromise(
    db
      .insert(comments)
      .values({
        id: random,
        slug,
        email,
        body: message,
        createdBy: created_by,
        createdAt: new Date().toISOString(),
      })
      .returning()
      .then((res) =>
        res.map((r) => ({
          id: r.id,
          slug: r.slug,
          email: r.email,
          body: r.body,
          created_by: r.createdBy,
          created_at: r.createdAt,
          updated_at: r.updatedAt,
        })),
      ),
    () => ({
      message: "Failed to save comment. Database error.",
      code: "DATABASE_ERROR" as const,
    }),
  );
