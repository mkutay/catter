'use server';

import { sql } from '@/lib/postgres';
import { EntryData } from '@/config/types';
import { err, errAsync, Result, ResultAsync } from 'neverthrow';

interface GetGuestbookEntriesError {
  message: string;
  code: 'LIMIT_OUT_OF_RANGE' | 'DATABASE_ERROR';
};

export async function getGuestbookEntries(limit?: number): Promise<Result<EntryData[], GetGuestbookEntriesError>> {
  limit = limit || 100;

  if (limit <= 0 || limit > 200) {
    return err({
      message: 'Limit out of allowed range.',
      code: 'LIMIT_OUT_OF_RANGE',
    });
  }

  const promise = sql<EntryData[]>`
    SELECT id, body, created_by, created_at, updated_at, email, color
    FROM guestbook
    ORDER BY created_at DESC
    LIMIT ${limit};
  `;

  return ResultAsync.fromPromise(promise, () => ({
    message: 'Failed to fetch guestbook entries. Database error.',
    code: 'DATABASE_ERROR'
  }));
}