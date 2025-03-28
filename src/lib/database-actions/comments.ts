'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { err, ok, Result, ResultAsync } from 'neverthrow';

import { auth } from '@/lib/auth';
import { sql } from '@/lib/postgres';
import { CommentData } from '@/config/types';
import { siteConfig } from '@/config/site';
import { commentsFormSchema } from '@/config/schema';

interface DatabaseError {
  message: string;
  code: 'DATABASE_ERROR';
};

interface SaveCommentError {
  message: string;
  code: 'UNAUTHORISED' | 'INVALID_COMMENT' | 'DATABASE_ERROR' | 'SUCCESS';
};

interface DeleteCommentError {
  message: string;
  code: 'UNAUTHORISED' | 'DATABASE_ERROR' | 'SUCCESS';
};

export async function saveComment({ slug, message }: { slug: string, message: string }): Promise<SaveCommentError> {
  const session = await auth();
  
  if (!session || !session.user) {
    return {
      message: 'Session not found.',
      code: 'UNAUTHORISED',
    }
  }

  const random = Math.floor(Math.random() * 10000000);

  const validation = commentsFormSchema.safeParse({
    message,
  });

  if (!validation.success) {
    return {
      message: 'Invalid comment: ' + validation.error.issues,
      code: 'INVALID_COMMENT',
    };
  }

  const email = session.user.email as string;
  const created_by = session.user.name as string;

  const inserted = await insertIntoComments(random, slug, email, message, created_by);

  if (inserted.isErr()) {
    return {
      message: inserted.error.message,
      code: inserted.error.code,
    };
  }

  revalidatePath(`/posts/${slug}`);

  return {
    message: 'Comment saved successfully.',
    code: 'SUCCESS',
  }
}

export async function deleteComment({ comment }: { comment: CommentData }): Promise<DeleteCommentError> {
  const session = await auth();
  
  if (!session || !session.user) {
    return {
      message: 'Session not found.',
      code: 'UNAUTHORISED',
    };
  }

  const email = session.user.email as string;

  if (!siteConfig.admins.includes(email) && comment.email !== email) {
    return {
      message: 'You are not authorized to delete this comment.',
      code: 'UNAUTHORISED',
    };
  }

  const deleted = await deleteFromComments(comment.id);
  if (deleted.isErr()) {
    return {
      message: deleted.error.message,
      code: deleted.error.code,
    };
  }

  // revalidatePath(`/posts/${comment.slug}`);
  revalidateTag('nextjs-blog-comments');

  return {
    message: 'Comment deleted successfully.',
    code: 'SUCCESS',
  };
}

async function deleteFromComments(id: string): Promise<Result<void, DatabaseError>> {
  const promise = sql<CommentData[]>`
    DELETE FROM comments
    WHERE id = (${id})
    RETURNING *;
  `;

  return ResultAsync
    .fromPromise(promise, () => ({
      message: 'Failed to delete comment. Database error.',
      code: 'DATABASE_ERROR'
    } as DatabaseError))
    .andThen((result) => {
      if (!result || result.length === 0) {
        return err({
          message: 'Comment not deleted from the database. Database error.',
          code: 'DATABASE_ERROR'
        } as DatabaseError);
      }

      if (result[0].id !== id) {
        return err({
          message: 'Comment ID mismatch. Comment not deleted correctly. Database error.',
          code: 'DATABASE_ERROR'
        } as DatabaseError);
      }

      return ok();
    });
}

async function insertIntoComments(random: number, slug: string, email: string, message: string, created_by: string): Promise<Result<void, DatabaseError>> {
  const promise = sql<CommentData[]>`
    INSERT INTO comments (id, slug, email, body, created_by, created_at)
    VALUES (${random}, ${slug}, ${email}, ${message}, ${created_by}, NOW())
    RETURNING *;
  `;

  return ResultAsync
    .fromPromise(promise, () => ({
      message: 'Failed to save comment. Database error.',
      code: 'DATABASE_ERROR'
    } as DatabaseError))
    .andThen((result) => {
      if (!result || result.length === 0) {
        return err({
          message: 'Comment not saved to the database. Database error.',
          code: 'DATABASE_ERROR'
        } as DatabaseError);
      }

      if (result[0].slug !== slug) {
        return err({
          message: 'Comment slug mismatch. Comment not saved correctly. Database error.',
          code: 'DATABASE_ERROR'
        } as DatabaseError);
      }

      return ok();
    });
}