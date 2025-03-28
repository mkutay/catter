'use server';

import { err, ok, Result, ResultAsync } from 'neverthrow';

import { auth } from '@/lib/auth';
import { sql } from '@/lib/postgres';
import { siteConfig } from '@/config/site';
import { ViewCount } from '@/config/types';

interface IncrementViewsError {
  message: string;
  code: 'DATABASE_ERROR' | 'AUTHORISED' | 'IN_DEVELOPMENT';
};

interface DatabaseError {
  message: string;
  code: 'DATABASE_ERROR';
};

export async function incrementViews(slug: string): Promise<Result<void, IncrementViewsError>> {
  const session = await auth();

  if (session && session.user && siteConfig.admins.includes(session.user.email as string)) {
    return err({
      message: 'Unauthorized.',
      code: 'AUTHORISED',
    });
  }

  if (process.env.NODE_ENV === 'development') {
    return err({
      message: 'Increment views is disabled in development.',
      code: 'IN_DEVELOPMENT',
    });
  }
  
  const inserted = await insertIntoViews(slug);

  if (inserted.isErr()) {
    return err({
      message: 'Failed to increment views.',
      code: 'DATABASE_ERROR',
    });
  }

  return ok();
}

async function insertIntoViews(slug: string): Promise<Result<void, DatabaseError>> {
  const promise = sql<ViewCount[]>`
    INSERT INTO views (slug, count)
    VALUES (${slug}, 1)
    ON CONFLICT (slug)
    DO UPDATE SET count = views.count + 1
    WHERE views.slug = ${slug}
    RETURNING *;
  `;

  return ResultAsync.fromPromise(promise, () => ({
    message: 'Failed to increment views. Database error.',
    code: 'DATABASE_ERROR',
  } as DatabaseError)).andThen((result) => {
    if (!result || result.length === 0) {
      return err({
        message: 'Not inserted into the views table. Database error.',
        code: 'DATABASE_ERROR',
      } as DatabaseError);
    }

    if (result[0].slug !== slug) {
      return err({
        message: 'Inserted incorrectly into the views table. Database error.',
        code: 'DATABASE_ERROR',
      } as DatabaseError);
    }

    return ok();
  });
}