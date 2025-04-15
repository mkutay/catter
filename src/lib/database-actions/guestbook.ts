'use server';

import { revalidatePath } from 'next/cache';
import { errAsync, okAsync, ResultAsync } from 'neverthrow';

import { doesAllEntriesExist, getGuestbookEntriesByEmail } from '@/lib/database-queries/guestbook';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/postgres';
import { siteConfig } from '@/config/site';
import { guestbookFormSchema, guestbookDialogFormSchema } from '@/config/schema';
import { EntryData } from '@/config/types';

interface SaveGuestbookEntryResult {
  message: string;
  code: 'DATABASE_ERROR' | 'VALIDATION_ERROR' | 'UNAUTHORISED' | 'RATE_LIMIT' | 'SUCCESS';
};

interface DeleteGuestbookEntriesResult {
  message: string;
  code: 'DATABASE_ERROR' | 'UNAUTHORISED' | 'NOT_ALL_ENTRIES_EXIST' | 'SUCCESS';
};

export const saveGuestbookEntryData = async ({
  color,
  username,
  message
}: {
  color?: string,
  username?: string,
  message: string
}) => {
  const session = await auth();

  if (!session || !session.user) {
    return {
      message: 'Unauthorized.',
      code: 'UNAUTHORISED',
    } as SaveGuestbookEntryResult;
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
    return {
      message: 'Validation error: ' + validationPopOver.error.message + ', ' + validationGuestbook.error.message,
      code: 'VALIDATION_ERROR',
    } as SaveGuestbookEntryResult;
  }

  const created_by = validationPopOver.success ? username : session.user.name as string;
  const email = session.user.email as string;

  if (!validationPopOver.success) {
    color = 'text';
  }

  const entriesOfEmailResult = await getGuestbookEntriesByEmail({ email });

  if (entriesOfEmailResult.isErr()) {
    return {
      message: 'Failed to fetch guestbook entries of user. Database error.',
      code: 'DATABASE_ERROR',
    } as SaveGuestbookEntryResult;
  }

  const entriesOfEmail = entriesOfEmailResult.value;
  if (entriesOfEmail.length !== 0) {
    const newestDate = new Date(entriesOfEmail[0].created_at);

    // Rate limit check
    if (Date.now() - newestDate.getTime() < 1000 * 15) {
      return {
        message: 'Rate limit exceeded. Please wait before submitting again.',
        code: 'RATE_LIMIT',
      } as SaveGuestbookEntryResult;
    }
  }

  const inserted = await insertIntoGuestbook(random, email, message, created_by, color);

  if (inserted.isErr()) {
    return {
      message: 'Failed to insert guestbook entry. Database error.',
      code: 'DATABASE_ERROR',
    } as SaveGuestbookEntryResult;
  }

  revalidatePath('/guestbook');
  revalidatePath('/admin');

  return {
    message: 'Saved guestbook entry successfully.',
    code: 'SUCCESS',
  } as SaveGuestbookEntryResult;
}

const insertIntoGuestbook = async (random: number, email: string, message: string, created_by: string, color: string) => {
  const promise = sql<EntryData[]>`
    INSERT INTO guestbook (id, email, body, created_by, created_at, color)
    VALUES (${random}, ${email}, ${message}, ${created_by}, NOW(), ${color})
    RETURNING *;
  `;

  return ResultAsync.fromPromise(promise, () => ({
    message: 'Failed to insert guestbook entry. Database error.',
    code: 'DATABASE_ERROR' as const,
  })).andThen((result) => {
    if (!result || result.length === 0) {
      return errAsync({
        message: 'Not inserted into the guestbook table. Database error.',
        code: 'DATABASE_ERROR' as const,
      });
    }

    if (result[0].id !== random) {
      return errAsync({
        message: 'Inserted incorrectly into the guestbook. Database error.',
        code: 'DATABASE_ERROR' as const,
      });
    }

    return okAsync();
  });
}

export const deleteGuestbookEntries = async (selectedEntries: number[]) => {
  const session = await auth();
  
  if (!session || !session.user) {
    return {
      message: 'Session not found. Unauthorized.',
      code: 'UNAUTHORISED',
    } as DeleteGuestbookEntriesResult;
  }

  const email = session.user.email as string;

  if (!siteConfig.admins.includes(email)) {
    return {
      message: 'Not an admin. Unauthorized.',
      code: 'UNAUTHORISED',
    } as DeleteGuestbookEntriesResult;
  }

  const exists = await doesAllEntriesExist({ ids: selectedEntries });

  if (exists.isErr()) {
    return {
      message: 'Failed to check guestbook entries. Database error. ' + exists.error.message,
      code: 'DATABASE_ERROR',
    } as DeleteGuestbookEntriesResult;
  }
  if (!exists.value) {
    return {
      message: 'Not all entries exist. Not performing.',
      code: 'NOT_ALL_ENTRIES_EXIST',
    } as DeleteGuestbookEntriesResult;
  }

  const arrayLiteral = `{${selectedEntries.join(',')}}`;
  const deleted = await deleteFromGuestbook(arrayLiteral);

  if (deleted.isErr()) {
    return {
      message: 'Failed to delete guestbook entry. Database error.',
      code: 'DATABASE_ERROR',
    } as DeleteGuestbookEntriesResult;
  }

  revalidatePath('/admin');
  revalidatePath('/guestbook');

  return {
    message: 'Deleted guestbook entries successfully.',
    code: 'SUCCESS',
  } as DeleteGuestbookEntriesResult;
}

const deleteFromGuestbook = (arrayLiteral: string) => {
  const promise = sql<EntryData[]>`
    DELETE FROM guestbook
    WHERE id = ANY(${arrayLiteral}::int[])
    RETURNING *;
  `;

  return ResultAsync.fromPromise(promise, () => ({
    message: 'Failed to delete guestbook entry. Database error.',
    code: 'DATABASE_ERROR' as const,
  })).andThen((result) => {
    if (!result || result.length === 0) {
      return errAsync({
        message: 'Not deleted from the guestbook table. Database error.',
        code: 'DATABASE_ERROR' as const,
      });
    }
    return okAsync();
  });
}
