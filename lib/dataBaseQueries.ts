'use server';

import { sql } from '@/lib/postgres';
import { commentMeta, entryMeta } from '@/config/site';


export async function getBlogViews(): Promise<
  number
> {
  if (!process.env.POSTGRES_URL) {
    return 0;
  }

  let views = await sql`
    SELECT count
    FROM views
  `;

  return views.reduce((acc, curr) => acc + Number(curr.count), 0);
}

export async function getViewsCount(): Promise<
  { slug: string; count: number }[]
> {
  if (!process.env.POSTGRES_URL) {
    return [];
  }

  return sql`
    SELECT slug, count
    FROM views
  `;
}

export async function getGuestbookEntries(): Promise<
  entryMeta[]
> {
  if (!process.env.POSTGRES_URL) {
    return [];
  }

  return sql`
    SELECT id, body, created_by, created_at, updated_at, email, color
    FROM guestbook
    ORDER BY created_at DESC
    LIMIT 300
  `;
}

export async function getComments({ slug }: { slug: string }): Promise<
  commentMeta[]
> {
  if (!process.env.POSTGRES_URL) {
    return [];
  }
  
  return sql`
    SELECT id, body, created_by, created_at, updated_at, email
    FROM comments
    WHERE slug = (${slug})
    ORDER BY created_at DESC
    LIMIT 15
  `;
}

export async function getAdmins(): Promise<
  { id: number, email: string, name: string}[]
> {
  if (!process.env.POSTGRES_URL) {
    return [];
  }
  
  return await sql`
    SELECT id, email, name
    FROM admins
  `;
}

export async function isAdmin(email: string): Promise<
  boolean
> {
  let adminFlag: boolean = false;
  const admins = await getAdmins();

  if (admins.length == 0) return true;

  admins.forEach((admin) => {
    if (admin.email == email) {
      adminFlag = true;
      return;
    }
  });

  return adminFlag;
}