'use server';

import { err, ok, Result, ResultAsync } from 'neverthrow';

import { sql } from '@/lib/postgres';
import { EntryData } from '@/config/types';

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

export async function doesAllEntriesExist(ids: number[]): Promise<Result<boolean, GetGuestbookEntriesError>> {
  if (ids.length === 0) {
    return err({
      message: 'No entries to check.',
      code: 'LIMIT_OUT_OF_RANGE',
    });
  }

  const promise = sql<{ id: number }[]>`
    SELECT id
    FROM guestbook
    WHERE id IN ${sql(ids)};
  `;

  return ResultAsync.fromPromise(promise, (e) => ({
    message: 'Failed to fetch guestbook entries. Database error. ' + e,
    code: 'DATABASE_ERROR'
  } as GetGuestbookEntriesError)).andThen((result) => {
    if (result.length !== ids.length) {
      return ok(false);
    }

    return ok(true);
  });
}

export async function getGuestbookEntriesByEmail(email: string): Promise<Result<EntryData[], GetGuestbookEntriesError>> {
  const promise = sql<EntryData[]>`
    SELECT *
    FROM guestbook
    WHERE email = ${email}
    ORDER BY created_at DESC;
  `;

  return ResultAsync.fromPromise(promise, () => ({
    message: 'Failed to fetch guestbook entries. Database error.',
    code: 'DATABASE_ERROR'
  }));
}