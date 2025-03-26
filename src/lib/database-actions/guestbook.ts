'use server';

import { revalidatePath } from 'next/cache';
import { PostgresError } from 'postgres';

import { auth, getSession } from '@/lib/auth';
import { sql } from '@/lib/postgres';
import { siteConfig } from '@/config/site';
import { guestbookFormSchema, guestbookDialogFormSchema } from '@/config/schema';

export async function saveGuestbookEntryData({
  color,
  username,
  message
}: {
  color?: string,
  username?: string,
  message: string
}) {
  const session = await auth();

  if (!session || !session.user) {
    throw new Error('Unauthorized');
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
      errors: validationGuestbook.error.issues,
    };
  }

  const created_by = validationPopOver.success ? username : session.user.name as string;
  const email = session.user.email as string;

  if (!validationPopOver.success) {
    color = 'text';
  }

  try {
    await sql`
      INSERT INTO guestbook (id, email, body, created_by, created_at, color)
      VALUES (${random}, ${email}, ${message}, ${created_by}, NOW(), ${color})
    `;
  } catch (error) {
    if ((error as PostgresError).code === '42P01') {
      // Table does not exist, so create the table
      await sql`
        CREATE TABLE IF NOT EXISTS guestbook (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) NOT NULL,
          body TEXT NOT NULL,
          created_by VARCHAR(255) NOT NULL,
          created_at TIMESTAMP NOT NULL,
          updated_at TIMESTAMP,
          color VARCHAR(255)
        )
      `;

      // Retry the insert after creating the table
      await sql`
        INSERT INTO guestbook (id, email, body, created_by, created_at, color)
        VALUES (${random}, ${email}, ${message}, ${created_by}, NOW(), ${color})
      `;
    } else {
      // Rethrow the error if it's not related to table existence
      throw error;
    }
  }

  revalidatePath('/guestbook');
}

export async function deleteGuestbookEntries(selectedEntries: number[]) {
  let session = await getSession();
  let email = session.user?.email as string;

  if (!siteConfig.admins.includes(email)) {
    throw new Error('Unauthorized');
  }

  let arrayLiteral = `{${selectedEntries.join(',')}}`;

  await sql`
    DELETE FROM guestbook
    WHERE id = ANY(${arrayLiteral}::int[])
  `;

  revalidatePath('/admin');
  revalidatePath('/guestbook');
}