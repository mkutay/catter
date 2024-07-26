'use server';

import { type Session } from 'next-auth';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';

import { auth } from '@/lib/auth';
import { sql } from '@/lib/postgres';
import { redirect } from 'next/navigation';

export async function incrementViews(slug: string) {
  noStore();

  let session = await auth();

  if (session && session.user && session.user?.email as string === 'hello@mkutay.dev') {
    return;
  }
  
  await sql`
    INSERT INTO views (slug, count)
    VALUES (${slug}, 1)
    ON CONFLICT (slug)
    DO UPDATE SET count = views.count + 1
  `;
}

// dormant
export async function incrementLikes(slug: string) {
  noStore();
  await sql`
    INSERT INTO likes (slug, count)
    VALUES (${slug}, 1)
    ON CONFLICT (slug)
    DO UPDATE SET count = likes.count + 1
  `;
}

async function getSession(): Promise<Session> {
  let session = await auth();
  if (!session || !session.user) {
    throw new Error('Unauthorized');
  }

  return session;
}

export async function saveGuestbookEntry(formData: FormData) {
  console.log(formData);
  let entry = formData.get('entry')?.toString() || '';
  let body = entry.slice(0, 1000);

  let random = Math.floor(Math.random() * 1000000);

  let session = await getSession();

  if (!session.user) {
    const email = formData.get('code')?.toString || String('');
    console.log(email);
    
    if (email != String('abracadabra')) {
      throw new Error('Unauthorized');
    }

    const created_by = formData.get('name')?.toString() || String('');

    await sql`
      INSERT INTO guestbook (id, email, body, created_by, created_at)
      VALUES (${random}, ${email}, ${body}, ${created_by}, NOW())
    `;
  } else {
    let email = session.user?.email as string;
    let created_by = session.user?.name as string;

    await sql`
      INSERT INTO guestbook (id, email, body, created_by, created_at)
      VALUES (${random}, ${email}, ${body}, ${created_by}, NOW())
    `;
  }

  revalidatePath('/guestbook');
}

export async function deleteGuestbookEntries(selectedEntries: string[]) {
  let session = await getSession();
  let email = session.user?.email as string;

  if (email !== 'hello@mkutay.dev') {
    throw new Error('Unauthorized');
  }

  let selectedEntriesAsNumbers = selectedEntries.map(Number);
  let arrayLiteral = `{${selectedEntriesAsNumbers.join(',')}}`;

  await sql`
    DELETE FROM guestbook
    WHERE id = ANY(${arrayLiteral}::int[])
  `;

  revalidatePath('/guestbook/admin');
  revalidatePath('/guestbook');
}