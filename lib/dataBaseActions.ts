'use server';

import { type Session } from 'next-auth';
import { revalidatePath, unstable_noStore as noStore, revalidateTag } from 'next/cache';

import { auth } from '@/lib/auth';
import { sql } from '@/lib/postgres';
import { commentMeta, siteConfig } from '@/config/site';
import { guestbookColors } from '@/app/guestbook/dialog';

export async function incrementViews(slug: string) {
  noStore();

  let session = await auth();

  if (session && session.user && siteConfig.guestbook.siteAdmins.includes(session.user?.email as string)) {
    return;
  }
  
  await sql`
    INSERT INTO views (slug, count)
    VALUES (${slug}, 1)
    ON CONFLICT (slug)
    DO UPDATE SET count = views.count + 1
  `;
}

async function getSession(): Promise<Session> {
  let session = await auth();
  
  if (!session || !session.user) {
    throw new Error('Unauthorized');
  }

  return session;
}

export async function saveGuestbookEntry({
  color,
  username,
  message
}: {
  color?: string,
  username?: string,
  message: string
}) {
  const body = message.slice(0, 500) as string;
  const random = Math.floor(Math.random() * 1000000);
  const session = await auth();

  if (!session || !session.user) {
    throw new Error('Unauthorized');
  }

  const created_by = username?.slice(0, 30) as string || session.user.name as string;
  const email = session.user.email as string;

  color = color || 'INVALID';

  if (!guestbookColors.includes({ label: color.charAt(0).toUpperCase() + color.slice(1), value: color })) {
    color = 'text';
  }

  await sql`
    INSERT INTO guestbook (id, email, body, created_by, created_at, color)
    VALUES (${random}, ${email}, ${body}, ${created_by}, NOW(), ${color})
  `;

  revalidatePath('/guestbook');
}

export async function deleteGuestbookEntries(selectedEntries: string[]) {
  let session = await getSession();
  let email = session.user?.email as string;

  if (!siteConfig.guestbook.siteAdmins.includes(email)) {
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

export async function revalidateGuestbook() {
  revalidatePath('/guestbook/admin');
  revalidatePath('/guestbook');
}

export async function saveComment({ slug, message }: { slug: string, message: string }) {
  const random = Math.floor(Math.random() * 10000000);
  const session = await auth();

  if (!session || !session.user) {
    throw new Error('Unauthorized');
  }

  const email = session.user?.email as string;
  const created_by = session.user?.name as string;

  await sql`
    INSERT INTO comments (id, slug, email, body, created_by, created_at)
    VALUES (${random}, ${slug}, ${email}, ${message}, ${created_by}, NOW())
  `;

  revalidatePath(`/posts/${slug}`);
}

export async function deleteComment({ comment }: { comment: commentMeta }) {
  let session = await getSession();
  let email = session.user?.email as string;

  if (!siteConfig.comments.siteAdmins.includes(email) && comment.email !== email) {
    throw new Error('Unauthorized');
  }

  await sql`
    DELETE FROM comments
    WHERE id = (${comment.id})
  `;

  // revalidatePath(`/posts/${comment.slug}`);
  revalidateTag('nextjs-blog-comments');
}

export async function revalidatePost({ slug }: { slug: string }) {
  revalidatePath(`/posts/${slug}`);
}