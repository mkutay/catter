'use server';

import { err, ok, Result, ResultAsync } from 'neverthrow';

import { sql } from '@/lib/postgres';
import { doesPostWithSlugExist } from '@/lib/contentQueries';
import { ViewCount } from '@/config/types';

interface GetBlogViewsError {
  message: string;
  code: 'DATABASE_ERROR';
};

interface GetViewsCountError {
  message: string;
  code: 'LIMIT_OUT_OF_RANGE' | 'DATABASE_ERROR'; 
};

interface GetViewCountError {
  message: string;
  code: 'POST_NOT_FOUND' | 'DATABASE_ERROR' | 'NO_VIEWS_FOUND';
};

export async function getBlogViews(): Promise<Result<number, GetBlogViewsError>> {
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

  return totalViewsPromise;
}

export async function getViewsCount(postNum: number): Promise<Result<ViewCount[], GetViewsCountError>> {
  if (postNum < 1 || postNum > 100) {
    return err({
      message: 'Limit out of allowed range.',
      code: 'LIMIT_OUT_OF_RANGE',
    });
  }

  const promise = sql<ViewCount[]>`
    SELECT slug, count
    FROM views
    ORDER BY count DESC
    LIMIT ${postNum};
  `;

  return ResultAsync.fromPromise(promise, () => ({
    message: 'Failed to fetch views count. Database error.',
    code: 'DATABASE_ERROR',
  }));
}

export async function getViewCount(slug: string): Promise<Result<number, GetViewCountError>> {
  if (!doesPostWithSlugExist(slug)) {
    return err({
      message: 'Post not found with slug: ' + slug,
      code: 'POST_NOT_FOUND',
    });
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
      return err({
        message: 'No views found for this post.',
        code: 'NO_VIEWS_FOUND',
      } as GetViewCountError);
    }
    return ok(views[0].count);
  });

  return viewsPromise;
}