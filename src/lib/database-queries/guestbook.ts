'use server';

import { sql } from '@/lib/postgres';
import { EntryData } from '@/config/types';

export async function getGuestbookEntries(limit?: number): Promise<EntryData[]> {
  limit = limit || 100;

  if (limit <= 0 || limit > 200) {
    throw new Error('Limit out of allowed range.');
  }

  return sql`
    SELECT id, body, created_by, created_at, updated_at, email, color
    FROM guestbook
    ORDER BY created_at DESC
    LIMIT ${limit};
  `;
}