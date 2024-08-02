'use server';

import { type Session } from 'next-auth';
import { PostgresError } from 'postgres';
import {
  revalidatePath,
  unstable_noStore as noStore,
} from 'next/cache';

import { auth } from '@/lib/auth';
import { sql } from '@/lib/postgres';
import { commentMeta, siteConfig } from '@/config/site';
import {
  commentsFormSchema,
  guestbookFormSchema,
  guestbookDialogFormSchema
} from '@/config/schema';
import { getAdmins, isAdmin } from '@/lib/dataBaseQueries';

export async function incrementViews(slug: string) {
  noStore();

  let session = await auth();

  if (session && session.user && (await isAdmin(session.user?.email as string))) {
    return;
  }
  
  try {
    await sql`
      INSERT INTO views (slug, count)
      VALUES (${slug}, 1)
      ON CONFLICT (slug)
      DO UPDATE SET count = views.count + 1
    `;
  } catch (error) {
    if ((error as PostgresError).code === '42P01') {
      // Table does not exist, so create the table
      await sql`
        CREATE TABLE IF NOT EXISTS views (
          slug TEXT PRIMARY KEY,
          count INT NOT NULL
        );
      `;

      // Retry the insert after creating the table
      await sql`
        INSERT INTO views (slug, count)
        VALUES (${slug}, 1)
        ON CONFLICT (slug)
        DO UPDATE SET count = views.count + 1
      `;
    } else {
      // Rethrow the error if it's not related to table existence
      throw error;
    }
  }
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

  const email = session.user.email as string;
  const created_by = validationPopOver.success ? username : session.user.name as string;

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
  revalidatePath('/guestbook/admin');
}

export async function deleteGuestbookEntries(selectedEntries: string[]) {
  let session = await getSession();
  let email = session.user?.email as string;

  if (!(await isAdmin(email))) {
    throw new Error('Unauthorized');
  }

  let selectedEntriesAsNumbers = selectedEntries.map(Number);
  let arrayLiteral = `{${selectedEntriesAsNumbers.join(',')}}`;

  await sql`
    DELETE FROM guestbook
    WHERE id = ANY(${arrayLiteral}::int[])
  `;

  revalidatePath('/guestbook');
  revalidatePath('/guestbook/admin');
}

export async function revalidateGuestbook() {
  revalidatePath('/guestbook');
  revalidatePath('/guestbook/admin');
}

export async function saveComment({ slug, message }: { slug: string, message: string }) {
  const session = await auth();
  
  if (!session || !session.user) {
    throw new Error('Unauthorized');
  }

  const random = Math.floor(Math.random() * 10000000);

  const validation = commentsFormSchema.safeParse({
    message,
  });

  if (!validation.success) {
    return {
      errors: validation.error.issues,
    };
  }

  const email = session.user?.email as string;
  const created_by = session.user?.name as string;

  try {
    await sql`
      INSERT INTO comments (id, slug, email, body, created_by, created_at)
      VALUES (${random}, ${slug}, ${email}, ${message}, ${created_by}, NOW())
    `;
  } catch (error) {
    if ((error as PostgresError).code === '42P01') {
      // Table does not exist, so create the table
      await sql`
        CREATE TABLE IF NOT EXISTS comments (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) NOT NULL,
          slug TEXT NOT NULL,
          body TEXT NOT NULL,
          created_by VARCHAR(255) NOT NULL,
          created_at TIMESTAMP NOT NULL,
          updated_at TIMESTAMP
        )
      `;

      // Retry the insert after creating the table
      await sql`
        INSERT INTO comments (id, slug, email, body, created_by, created_at)
        VALUES (${random}, ${slug}, ${email}, ${message}, ${created_by}, NOW())
      `;
    } else {
      // Rethrow the error if it's not related to table existence
      throw error;
    }
  }

  revalidatePath(`/posts/${slug}`);
}

export async function deleteComment({ comment }: { comment: commentMeta }) {
  const session = await getSession();
  const email = session.user?.email as string;

  if (!(await isAdmin(email)) && comment.email !== email) {
    throw new Error('Unauthorized');
  }

  await sql`
    DELETE FROM comments
    WHERE id = (${comment.id})
  `;

  revalidatePath(`/posts/${comment.slug}`);
}

export async function revalidatePost({ slug }: { slug: string }) {
  revalidatePath(`/posts/${slug}`);
}

export async function addAdmin({ email, name }: { email: string, name: string }) {
  const session = await getSession();
  const admins = await getAdmins();

  if (!(await isAdmin(session.user?.email as string))) {
    throw new Error('Unauthorized');
  }

  const random = Math.floor(Math.random() * 10000000);

  try {
    await sql`
      INSERT INTO admins (id, email, name)
      VALUES (${random}, ${email}, ${name})
    `;
  } catch (error) {
    if ((error as PostgresError).code === '42P01') {
      // Table does not exist, so create the table
      await sql`
        CREATE TABLE IF NOT EXISTS admins (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) NOT NULL,
          name TEXT NOT NULL
        )
      `;

      // Retry the insert after creating the table
      await sql`
        INSERT INTO admins (id, email, name)
        VALUES (${random}, ${email}, ${name})
      `;
    } else {
      // Rethrow the error if it's not related to table existence
      throw error;
    }
  }

  revalidatePath('/admin');
}

export async function deleteAdmins(ids: number[]) {
  const session = await getSession();

  if (!(await isAdmin(session.user?.email as string))) {
    throw new Error('Unauthorized');
  }

  let arrayLiteral = `{${ids.join(',')}}`;

  await sql`
    DELETE FROM admins
    WHERE id = ANY(${arrayLiteral}::int[])
  `;

  revalidatePath('/admin');
}