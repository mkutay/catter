import { errAsync, okAsync, ResultAsync } from 'neverthrow';

import { EntryData } from '@/config/types';
import { sql } from '@/lib/postgres';

interface GetGuestbookEntriesError {
  message: string;
  code: 'LIMIT_OUT_OF_RANGE' | 'DATABASE_ERROR';
};

interface DoesAllEntriesExistError {
  message: string;
  code: 'NO_IDS_GIVEN' | 'DATABASE_ERROR';
}

export const getGuestbookEntries = (props?: { limit: number }) =>
  okAsync(props ? props.limit : 100)
    .andThen((limit) =>
      limit <= 0 || limit > 200
        ? errAsync({
            message: 'Limit out of allowed range.',
            code: 'LIMIT_OUT_OF_RANGE',
          } as GetGuestbookEntriesError)
        : ResultAsync.fromPromise(
            sql<EntryData[]>`
              SELECT id, body, created_by, created_at, updated_at, email, color
              FROM guestbook
              ORDER BY created_at DESC
              LIMIT ${limit};
            `,
            () => ({
              message: 'Failed to fetch guestbook entries. Database error.',
              code: 'DATABASE_ERROR'
            } as GetGuestbookEntriesError)
          )
          .map((entries) => entries as EntryData[])
    );

export const doesAllEntriesExist = ({ ids }: { ids: number[] }) =>
  ids.length === 0
    ? errAsync({
        message: 'No entries to check.',
        code: 'NO_IDS_GIVEN',
      } as DoesAllEntriesExistError)
    : ResultAsync.fromPromise(
        sql<{ id: number }[]>`
          SELECT id
          FROM guestbook
          WHERE id IN ${sql(ids)};
        `,
        () => ({
          message: 'Failed to fetch guestbook entries. Database error.',
          code: 'DATABASE_ERROR'
        } as DoesAllEntriesExistError)
      )
      .andThen((result) =>
        okAsync(result.length === ids.length)
      );

export const getGuestbookEntriesByEmail = ({ email }: { email: string }) =>
  ResultAsync.fromPromise(
    sql<EntryData[]>`
      SELECT *
      FROM guestbook
      WHERE email = ${email}
      ORDER BY created_at DESC;
    `,
    () => ({
      message: 'Failed to fetch guestbook entries. Database error.',
      code: 'DATABASE_ERROR' as const,
    })
  );