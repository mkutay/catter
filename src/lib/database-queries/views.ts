import { errAsync, okAsync, ResultAsync } from 'neverthrow';
import { unstable_noStore } from 'next/cache';

import { doesPostWithSlugExist } from '@/lib/contentQueries';
import { sql } from '@/lib/postgres';
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

export const getBlogViews = () => {
  unstable_noStore();
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

export const getViewsCount = ({ postNum }: { postNum: number }) => {
  unstable_noStore();
  if (postNum < 1 || postNum > 100) {
    return errAsync({
      message: 'Limit out of allowed range.',
      code: 'LIMIT_OUT_OF_RANGE',
    } as GetViewsCountError);
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
  } as GetViewsCountError));
}

export const getViewCount = ({ slug }: { slug: string }) => {
  unstable_noStore();
  if (!doesPostWithSlugExist(slug)) {
    return errAsync({
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

  return viewsPromise;
}