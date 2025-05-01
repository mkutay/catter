'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { errAsync, okAsync, ResultAsync } from 'neverthrow';

import { getCommentsByEmail } from '@/lib/database-queries/comments';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/postgres';
import { CommentData } from '@/config/types';
import { siteConfig } from '@/config/site';
import { commentsFormSchema } from '@/config/schema';
import { doesPostWithSlugExist } from '../contentQueries';
import { resultAsyncToActionResult } from '../action-result';

interface SaveCommentResult {
  message: string;
  code: 'UNAUTHORISED' | 'INVALID_COMMENT' | 'DATABASE_ERROR' | 'SUCCESS' | 'RATE_LIMIT';
};

interface DeleteCommentResult {
  message: string;
  code: 'UNAUTHORISED' | 'DATABASE_ERROR' | 'SUCCESS';
};

export const saveComment = async ({ slug, message }: { slug: string, message: string }) => {
  const session = await auth();
  
  if (!session || !session.user) {
    return {
      message: 'Session not found.',
      code: 'UNAUTHORISED',
    } as SaveCommentResult;
  }

  const random = Math.floor(Math.random() * 10000000);

  const validation = commentsFormSchema.safeParse({
    message,
  });

  if (!validation.success) {
    return {
      message: 'Invalid comment: ' + validation.error.issues,
      code: 'INVALID_COMMENT',
    } as SaveCommentResult;
  }

  const email = session.user.email as string;
  const created_by = session.user.name as string;

  const commentsOfEmailResult = await getCommentsByEmail({ email });
  if (commentsOfEmailResult.isErr()) {
    return {
      message: 'Failed to fetch comments of user. Database error.',
      code: 'DATABASE_ERROR',
    } as SaveCommentResult;
  }
  const commentsOfEmail = commentsOfEmailResult.value;
  if (commentsOfEmail.length > 0) {
    const newestDate = new Date(commentsOfEmail[0].created_at);

    // Rate limit check
    if (Date.now() - newestDate.getTime() < 1000 * 60 * 5) {
      return {
        message: 'Rate limit exceeded. Please wait before submitting again.',
        code: 'RATE_LIMIT',
      } as SaveCommentResult;
    }
  }

  const inserted = await insertIntoComments(random, slug, email, message, created_by);

  if (inserted.isErr()) {
    return {
      message: inserted.error.message,
      code: inserted.error.code,
    } as SaveCommentResult;
  }

  revalidatePath(`/posts/${slug}`);

  return {
    message: 'Comment saved successfully.',
    code: 'SUCCESS',
  } as SaveCommentResult;
}

export const deleteComment = async ({ comment }: { comment: CommentData }) => {
  const session = await auth();
  
  if (!session || !session.user) {
    return {
      message: 'Session not found.',
      code: 'UNAUTHORISED',
    } as DeleteCommentResult;
  }

  const email = session.user.email as string;

  if (!siteConfig.admins.includes(email) && comment.email !== email) {
    return {
      message: 'You are not authorized to delete this comment.',
      code: 'UNAUTHORISED',
    } as DeleteCommentResult;
  }

  const deleted = await deleteFromComments(comment.id);
  if (deleted.isErr()) {
    return {
      message: deleted.error.message,
      code: deleted.error.code,
    } as DeleteCommentResult;
  }

  // revalidatePath(`/posts/${comment.slug}`);
  revalidateTag('nextjs-blog-comments');

  return {
    message: 'Comment deleted successfully.',
    code: 'SUCCESS',
  } as DeleteCommentResult;
}

const deleteFromComments = (id: string) => {
  const promise = sql<CommentData[]>`
    DELETE FROM comments
    WHERE id = (${id})
    RETURNING *;
  `;

  return ResultAsync
    .fromPromise(promise, () => ({
      message: 'Failed to delete comment. Database error.',
      code: 'DATABASE_ERROR' as const,
    }))
    .andThen((result) => {
      if (!result || result.length === 0) {
        return errAsync({
          message: 'Comment not deleted from the database. Database error.',
          code: 'DATABASE_ERROR' as const,
        });
      }

      if (result[0].id !== id) {
        return errAsync({
          message: 'Comment ID mismatch. Comment not deleted correctly. Database error.',
          code: 'DATABASE_ERROR' as const,
        });
      }

      return okAsync();
    });
}

const insertIntoComments = (random: number, slug: string, email: string, message: string, created_by: string) => {
  const promise = sql<CommentData[]>`
    INSERT INTO comments (id, slug, email, body, created_by, created_at)
    VALUES (${random}, ${slug}, ${email}, ${message}, ${created_by}, NOW())
    RETURNING *;
  `;

  return ResultAsync
    .fromPromise(promise, () => ({
      message: 'Failed to save comment. Database error.',
      code: 'DATABASE_ERROR' as const
    }))
    .andThen((result) => {
      if (!result || result.length === 0) {
        return errAsync({
          message: 'Comment not saved to the database. Database error.',
          code: 'DATABASE_ERROR' as const
        });
      }

      if (result[0].slug !== slug) {
        return errAsync({
          message: 'Comment slug mismatch. Comment not saved correctly. Database error.',
          code: 'DATABASE_ERROR' as const
        });
      }

      return okAsync();
    });
}

interface GetCommentsError {
  message: string;
  code: 'POST_NOT_FOUND' | 'DATABASE_ERROR';
};

export const getComments = async ({ slug }: { slug: string }) => resultAsyncToActionResult(
  !doesPostWithSlugExist(slug)
    ? errAsync({
        message: 'Post not found.',
        code: 'POST_NOT_FOUND',
      } as GetCommentsError)
    : ResultAsync.fromPromise(
        sql<CommentData[]>`
          SELECT id, body, created_by, created_at, updated_at, email
          FROM comments
          WHERE slug = (${slug})
          ORDER BY created_at DESC
          LIMIT 15;
        `,
        () => ({
          message: 'Failed to fetch comments. Database error.',
          code: 'DATABASE_ERROR'
        } as GetCommentsError)
      )
      .map((comments) => comments as CommentData[])
);