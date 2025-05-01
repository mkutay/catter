import { errAsync, ResultAsync } from 'neverthrow';
import { unstable_noStore } from 'next/cache';

import { sql } from '@/lib/postgres';
import { ViewCount } from '@/config/types';

interface GetViewsCountError {
  message: string;
  code: 'LIMIT_OUT_OF_RANGE' | 'DATABASE_ERROR'; 
};

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