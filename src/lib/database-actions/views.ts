'use server';

import { errAsync, okAsync, ResultAsync } from 'neverthrow';

import { actionErr, actionOk, ActionResult, resultAsyncToActionResult } from '@/lib/action-result';
import { sql } from '@/lib/postgres';
import { auth } from '@/lib/auth';
import { ViewCount } from '@/config/types';
import { siteConfig } from '@/config/site';
import { doesPostWithSlugExist } from '../contentQueries';

interface IncrementViewsError {
  message: string;
  code: 'DATABASE_ERROR' | 'AUTHORISED' | 'IN_DEVELOPMENT';
};

export const incrementViews = async (slug: string): Promise<ActionResult<number, IncrementViewsError>> => {
  if (process.env.NODE_ENV === 'development') {
    const view = await getViewCount({ slug });
    if (!view.ok) {
      return actionErr({
        message: 'Failed to get view count.',
        code: 'DATABASE_ERROR',
      } as IncrementViewsError);
    }
    return actionOk(view.value);
  }
  
  const session = await auth();

  if (session && session.user && siteConfig.admins.includes(session.user.email as string)) {
    const view = await getViewCount({ slug });
    if (!view.ok) {
      return actionErr({
        message: 'Failed to get view count.',
        code: 'DATABASE_ERROR',
      } as IncrementViewsError);
    }
    return actionOk(view.value);
  }
  
  const inserted = await insertIntoViews(slug);

  if (inserted.isErr()) {
    return actionErr({
      message: 'Failed to increment views.',
      code: 'DATABASE_ERROR',
    } as IncrementViewsError);
  }

  return actionOk(inserted.value.count);
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

    return okAsync(result[0]);
  });
}

interface GetBlogViewsError {
  message: string;
  code: 'DATABASE_ERROR';
};

export const getBlogViews = async () => {
  const promise = sql<{ count: number }[]>`
    SELECT count
    FROM views;
  `;

  const databasePromise = ResultAsync.fromPromise(promise, () => ({
    message: 'Failed to fetch blog views. Database error.',
    code: 'DATABASE_ERROR',
  } as GetBlogViewsError));

  const totalViewsPromise = databasePromise.map((views) => {
    return views.reduce((acc, curr) => acc + Number(curr.count), 0);
  });

  return resultAsyncToActionResult(totalViewsPromise);
}

interface GetViewCountError {
  message: string;
  code: 'POST_NOT_FOUND' | 'DATABASE_ERROR' | 'NO_VIEWS_FOUND';
};

export const getViewCount = async ({ slug }: { slug: string }): Promise<ActionResult<number, GetViewCountError>> => {
  if (!doesPostWithSlugExist(slug)) {
    return actionErr({
      message: 'Post not found with slug: ' + slug,
      code: 'POST_NOT_FOUND',
    } as GetViewCountError);
  }

  const promise = sql<ViewCount[]>`
    SELECT slug, count
    FROM views
    WHERE slug=(${slug});
  `;

  const databasePromise = ResultAsync.fromPromise(promise, () => ({
    message: 'Failed to fetch view count. Database error.',
    code: 'DATABASE_ERROR',
  } as GetViewCountError));

  const viewsPromise = databasePromise.andThen((views) => {
    if (views.length === 0 || !views[0]) {
      return errAsync({
        message: 'No views found for this post.',
        code: 'NO_VIEWS_FOUND',
      } as GetViewCountError);
    }
    return okAsync(views[0].count);
  });

  return resultAsyncToActionResult(viewsPromise);
}