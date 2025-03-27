'use server';

import { revalidatePath } from 'next/cache';

import { auth } from '@/lib/auth';
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

  await insertIntoGuestbook(random, email, message, created_by, color);

  revalidatePath('/guestbook');
  revalidatePath('/admin');
}

async function insertIntoGuestbook(random: number, email: string, message: string, created_by: string, color: string) {
  await sql`
    INSERT INTO guestbook (id, email, body, created_by, created_at, color)
    VALUES (${random}, ${email}, ${message}, ${created_by}, NOW(), ${color})
  `;
}

export async function deleteGuestbookEntries(selectedEntries: number[]) {
  const session = await auth();
  
  if (!session || !session.user) {
    throw new Error('Unauthorized');
  }

  let email = session.user.email as string;

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