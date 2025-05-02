import { errAsync, okAsync, ResultAsync } from 'neverthrow';

import { doesPostWithSlugExist } from '@/lib/contentQueries';
import { ViewCount } from '@/config/types';
import { sql } from '@/lib/postgres';

interface GetViewsCountError {
  message: string;
  code: 'LIMIT_OUT_OF_RANGE' | 'DATABASE_ERROR'; 
};

interface GetBlogViewsError {
  message: string;
  code: 'DATABASE_ERROR';
};

interface GetViewCountError {
  message: string;
  code: 'POST_NOT_FOUND' | 'DATABASE_ERROR' | 'NO_VIEWS_FOUND';
};

export const getBlogViews = () => ResultAsync
  .fromPromise(
    sql<{ count: number }[]>`
      SELECT count
      FROM views;
    `,
    () => ({
      message: 'Failed to fetch blog views. Database error.',
      code: 'DATABASE_ERROR',
    } as GetBlogViewsError)
  )
  .map((views) => {
    return views.reduce((acc, curr) => acc + Number(curr.count), 0);
  });

export const getViewsCount = ({ postNum }: { postNum: number }) =>
  postNum < 1 || postNum > 100
    ? errAsync({
        message: 'Limit out of allowed range.',
        code: 'LIMIT_OUT_OF_RANGE',
      } as GetViewsCountError)
    : ResultAsync.fromPromise(
        sql<ViewCount[]>`
          SELECT slug, count
          FROM views
          ORDER BY count DESC
          LIMIT ${postNum};
        `,
        () => ({
            message: 'Failed to fetch views count. Database error.',
            code: 'DATABASE_ERROR',
          } as GetViewsCountError)
      );

export const getViewCount = ({ slug }: { slug: string }) =>
  !doesPostWithSlugExist(slug)
    ? errAsync({
        message: 'Post not found with slug: ' + slug,
        code: 'POST_NOT_FOUND',
      } as GetViewCountError)
    : ResultAsync.fromPromise(
        sql<ViewCount[]>`
          SELECT slug, count
          FROM views
          WHERE slug=(${slug});
        `,
        () => ({
            message: 'Failed to fetch view count. Database error.',
            code: 'DATABASE_ERROR',
          } as GetViewCountError)
      )
      .andThen((views) => 
        views.length === 0 || !views[0]
          ? errAsync({
              message: 'No views found for this post.',
              code: 'NO_VIEWS_FOUND',
            } as GetViewCountError)
          : okAsync(views[0].count)
      );