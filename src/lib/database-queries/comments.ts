'use server';

import { err, Result, ResultAsync } from 'neverthrow';

import { doesPostWithSlugExist } from '@/lib/contentQueries';
import { sql } from '@/lib/postgres';
import { CommentData } from '@/config/types';

interface GetCommentsError {
  message: string;
  code: 'POST_NOT_FOUND' | 'DATABASE_ERROR';
};

interface GetEveryCommentError {
  message: string;
  code: 'LIMIT_OUT_OF_RANGE' | 'DATABASE_ERROR';
};

/* Limiting to 15 to avoid loading too many comments at once. */

export async function getComments({ slug }: { slug: string }): Promise<Result<CommentData[], GetCommentsError>> {
  if (!doesPostWithSlugExist(slug)) {
    return err({
      message: 'Post not found.',
      code: 'POST_NOT_FOUND',
    });
  }

  const promise = sql<CommentData[]>`
    SELECT id, body, created_by, created_at, updated_at, email
    FROM comments
    WHERE slug = (${slug})
    ORDER BY created_at DESC
    LIMIT 15;
  `;

  return ResultAsync.fromPromise(promise, () => ({
    message: 'Failed to fetch comments. Database error.',
    code: 'DATABASE_ERROR'
  }));
}

export async function getEveryComment(limit?: number): Promise<Result<CommentData[], GetEveryCommentError>> {
  limit = limit || 15;

  if (limit <= 0 || limit > 100) {
    return err({
      message: 'Limit out of allowed range.',
      code: 'LIMIT_OUT_OF_RANGE',
    });
  }

  const promise = sql<CommentData[]>`
    SELECT id, slug, body, created_by, created_at, updated_at, email
    FROM comments
    ORDER BY created_at DESC
    LIMIT ${limit};
  `;

  return ResultAsync.fromPromise(promise, () => ({
    message: 'Failed to fetch comments. Database error.',
    code: 'DATABASE_ERROR'
  }));
}