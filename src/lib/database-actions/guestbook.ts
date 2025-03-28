'use server';

import { revalidatePath } from 'next/cache';
import { err, ok, Result, ResultAsync } from 'neverthrow';

import { doesAllEntriesExist } from '@/lib/database-queries/guestbook';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/postgres';
import { siteConfig } from '@/config/site';
import { guestbookFormSchema, guestbookDialogFormSchema } from '@/config/schema';
import { EntryData } from '@/config/types';

interface SaveGuestbookEntryError {
  message: string;
  code: 'DATABASE_ERROR' | 'VALIDATION_ERROR' | 'UNAUTHORISED';
};

interface DatabaseError {
  message: string;
  code: 'DATABASE_ERROR';
};

interface DeleteGuestbookEntriesError {
  message: string;
  code: 'DATABASE_ERROR' | 'UNAUTHORISED' | 'NOT_ALL_ENTRIES_EXIST';
};

export async function saveGuestbookEntryData({
  color,
  username,
  message
}: {
  color?: string,
  username?: string,
  message: string
}): Promise<Result<void, SaveGuestbookEntryError>> {
  const session = await auth();

  if (!session || !session.user) {
    return err({
      message: 'Unauthorized.',
      code: 'UNAUTHORISED',
    });
  }

  username = username || '';
  color = color || 'text';

  const random = Math.floor(Math.random() * 1000000);

  const validationPopOver = guestbookDialogFormSchema.safeParse({
    color,
    message,
    username
  });

  const validationGuestbook = guestbookFormSchema.safeParse({
    message
  });

  if (!validationPopOver.success && !validationGuestbook.success) {
    return err({
      message: 'Validation error: ' + validationPopOver.error.message + ', ' + validationGuestbook.error.message,
      code: 'VALIDATION_ERROR',
    })
  }

  const created_by = validationPopOver.success ? username : session.user.name as string;
  const email = session.user.email as string;

  if (!validationPopOver.success) {
    color = 'text';
  }

  const inserted = await insertIntoGuestbook(random, email, message, created_by, color);

  if (inserted.isErr()) {
    return err({
      message: 'Failed to insert guestbook entry. Database error.',
      code: 'DATABASE_ERROR',
    } as SaveGuestbookEntryError);
  }

  revalidatePath('/guestbook');
  revalidatePath('/admin');

  return ok();
}

async function insertIntoGuestbook(random: number, email: string, message: string, created_by: string, color: string): Promise<Result<void, DatabaseError>> {
  const promise = sql<EntryData[]>`
    INSERT INTO guestbook (id, email, body, created_by, created_at, color)
    VALUES (${random}, ${email}, ${message}, ${created_by}, NOW(), ${color})
    RETURNING *;
  `;

  return ResultAsync.fromPromise(promise, () => ({
    message: 'Failed to insert guestbook entry. Database error.',
    code: 'DATABASE_ERROR',
  } as DatabaseError)).andThen((result) => {
    if (!result || result.length === 0) {
      return err({
        message: 'Not inserted into the guestbook table. Database error.',
        code: 'DATABASE_ERROR',
      } as DatabaseError);
    }

    if (result[0].id !== random) {
      return err({
        message: 'Inserted incorrectly into the guestbook. Database error.',
        code: 'DATABASE_ERROR',
      } as DatabaseError);
    }

    return ok();
  });
}

export async function deleteGuestbookEntries(selectedEntries: number[]): Promise<Result<void, DeleteGuestbookEntriesError>> {
  const session = await auth();
  
  if (!session || !session.user) {
    return err({
      message: 'Session not found. Unauthorized.',
      code: 'UNAUTHORISED',
    });
  }

  const email = session.user.email as string;

  if (!siteConfig.admins.includes(email)) {
    return err({
      message: 'Not an admin. Unauthorized.',
      code: 'UNAUTHORISED',
    });
  }

  const exists = await doesAllEntriesExist(selectedEntries);

  if (exists.isErr()) {
    return err({
      message: 'Failed to check guestbook entries. Database error.',
      code: 'DATABASE_ERROR',
    });
  }
  if (!exists.value) {
    return err({
      message: 'Not all entries exist. Not performing.',
      code: 'NOT_ALL_ENTRIES_EXIST',
    });
  }

  const arrayLiteral = `{${selectedEntries.join(',')}}`;
  const deleted = await deleteFromGuestbook(arrayLiteral);

  if (deleted.isErr()) {
    return err({
      message: 'Failed to delete guestbook entry. Database error.',
      code: 'DATABASE_ERROR',
    });
  }

  revalidatePath('/admin');
  revalidatePath('/guestbook');

  return ok();
}

async function deleteFromGuestbook(arrayLiteral: string): Promise<Result<void, DatabaseError>> {
  const promise = sql<EntryData[]>`
    DELETE FROM guestbook
    WHERE id = ANY(${arrayLiteral}::int[])
    RETURNING *;
  `;

  return ResultAsync.fromPromise(promise, () => ({
    message: 'Failed to delete guestbook entry. Database error.',
    code: 'DATABASE_ERROR',
  } as DatabaseError)).andThen((result) => {
    if (!result || result.length === 0) {
      return err({
        message: 'Not deleted from the guestbook table. Database error.',
        code: 'DATABASE_ERROR',
      } as DatabaseError);
    }
    return ok();
  });
}