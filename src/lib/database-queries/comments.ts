import { errAsync, okAsync, ResultAsync } from 'neverthrow';

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

interface GetCommentsByEmailError {
  message: string;
  code: 'DATABASE_ERROR';
};

/* Limiting to 15 to avoid loading too many comments at once. */
export const getComments = ({ slug }: { slug: string }) =>
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

export const getEveryComment = (props?: { limit: number }) => 
  okAsync(props ? props.limit : 15)
  .andThen((limit) =>
    limit <= 0 || limit > 100
      ? errAsync({
          message: 'Limit out of allowed range.',
          code: 'LIMIT_OUT_OF_RANGE',
        } as GetEveryCommentError)
      : ResultAsync.fromPromise(
          sql<CommentData[]>`
            SELECT id, slug, body, created_by, created_at, updated_at, email
            FROM comments
            ORDER BY created_at DESC
            LIMIT ${limit};
          `,
          () => ({
            message: 'Failed to fetch comments. Database error.',
            code: 'DATABASE_ERROR'
          } as GetEveryCommentError)
        )
  );

export const getCommentsByEmail = ({ email }: { email: string }) =>
  ResultAsync.fromPromise(
    sql<CommentData[]>`
      SELECT id, slug, body, created_by, created_at, updated_at
      FROM comments
      WHERE email = (${email})
      ORDER BY created_at DESC;
    `,
    () => ({
      message: 'Failed to fetch comments. Database error.',
      code: 'DATABASE_ERROR'
    } as GetCommentsByEmailError)
  );