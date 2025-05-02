import { err, errAsync, ok, okAsync, ResultAsync } from 'neverthrow';

import { getCommentsByEmail } from '@/lib/database-queries/comments';
import { sql } from '@/lib/postgres';
import { CommentData } from '@/config/types';
import { siteConfig } from '@/config/site';
import { commentsFormSchema } from '@/config/schema';
import { doesPostWithSlugExist } from '@/lib/contentQueries';
import { getAuth } from '@/lib/database-queries/auth';
import { parseSchema } from '@/lib/utils';

interface SaveCommentError {
  message: string;
  code: 'UNAUTHORISED' | 'INVALID_SLUG' | 'RATE_LIMIT';
};

interface DeleteCommentError {
  message: string;
  code: 'UNAUTHORISED' | 'DATABASE_ERROR';
};

export const saveComment = ({ slug, message }: { slug: string, message: string }) => 
  parseSchema(commentsFormSchema, { message })
  .andThen(() => doesPostWithSlugExist(slug)
    ? ok()
    : err({
        message: 'Post not found.',
        code: 'INVALID_SLUG',
      } as SaveCommentError)
  )
  .asyncAndThen(() => getAuth())
  .andThen((session) =>
    !session || !session.user
      ? errAsync({
          message: 'Session not found.',
          code: 'UNAUTHORISED',
        } as SaveCommentError)
      : okAsync({
        email: session.user.email || '',
        name: session.user.name || '',
      })
  )
  .andThen(({ email, name }) =>
    getCommentsByEmail({ email })
    .andThen((comments) => 
      // 5 minutes rate limit
      comments.length > 0 && Date.now() - new Date(comments[0].created_at).getTime() < 1000 * 60 * 5
        ? errAsync({
            message: 'Rate limit exceeded. Please wait before submitting again.',
            code: 'RATE_LIMIT',
          } as SaveCommentError)
        : okAsync()
    )
    .andThen(() => insertIntoComments(Math.floor(Math.random() * 10000000), slug, email, message, name))
  );

export const deleteComment = ({ comment }: { comment: CommentData }) =>
  getAuth()
    .andThen((session) =>
      !session.user
        ? errAsync({
            message: 'Session not found.',
            code: 'UNAUTHORISED',
          } as DeleteCommentError)
        : okAsync(session.user.email || '')
    )
    .andThen((email) =>
      !siteConfig.admins.includes(email) && comment.email !== email
        ? errAsync({
            message: 'You are not authorized to delete this comment.',
            code: 'UNAUTHORISED',
          } as DeleteCommentError)
        : okAsync()
    )
    .andThen(() => deleteFromComments(comment.id));

const deleteFromComments = (id: string) => ResultAsync
  .fromPromise(
    sql<CommentData[]>`
      DELETE FROM comments
      WHERE id = (${id})
      RETURNING *;
    `,
    () => ({
      message: 'Failed to delete comment. Database error.',
      code: 'DATABASE_ERROR' as const,
    })
  );

const insertIntoComments = (random: number, slug: string, email: string, message: string, created_by: string) => ResultAsync
  .fromPromise(
    sql<CommentData[]>`
      INSERT INTO comments (id, slug, email, body, created_by, created_at)
      VALUES (${random}, ${slug}, ${email}, ${message}, ${created_by}, NOW())
      RETURNING *;
    `,
    () => ({
      message: 'Failed to save comment. Database error.',
      code: 'DATABASE_ERROR' as const
    })
  );