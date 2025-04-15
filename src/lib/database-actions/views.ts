'use server';

import { errAsync, okAsync, Result, ResultAsync } from 'neverthrow';

import { auth } from '@/lib/auth';
import { sql } from '@/lib/postgres';
import { siteConfig } from '@/config/site';
import { ViewCount } from '@/config/types';

interface IncrementViewsError {
  message: string;
  code: 'DATABASE_ERROR' | 'AUTHORISED' | 'IN_DEVELOPMENT';
};

export const incrementViews = async (slug: string): Promise<Result<void, IncrementViewsError>> => {
  if (process.env.NODE_ENV === 'development') {
    return errAsync({
      message: 'Increment views is disabled in development.',
      code: 'IN_DEVELOPMENT',
    } as IncrementViewsError);
  }
  
  const session = await auth();

  if (session && session.user && siteConfig.admins.includes(session.user.email as string)) {
    return errAsync({
      message: 'Authorised as admin.',
      code: 'AUTHORISED',
    } as IncrementViewsError);
  }
  
  const inserted = await insertIntoViews(slug);

  if (inserted.isErr()) {
    return errAsync({
      message: 'Failed to increment views.',
      code: 'DATABASE_ERROR',
    } as IncrementViewsError);
  }

  return okAsync();
}

const insertIntoViews = (slug: string) => {
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
    code: 'DATABASE_ERROR' as const,
  })).andThen((result) => {
    if (!result || result.length === 0) {
      return errAsync({
        message: 'Not inserted into the views table. Database error.',
        code: 'DATABASE_ERROR' as const,
      });
    }

    if (result[0].slug !== slug) {
      return errAsync({
        message: 'Inserted incorrectly into the views table. Database error.',
        code: 'DATABASE_ERROR' as const,
      });
    }

    return okAsync();
  });
}