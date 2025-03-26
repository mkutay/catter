'use server';

import {
  unstable_noStore as noStore,
} from 'next/cache';

import { sql } from '@/lib/postgres';
import { commentType, entryType } from '@/config/schema';


export async function getBlogViews() {
  if (!process.env.POSTGRES_URL) {
    return [];
  }

  noStore();
  let views = await sql`
    SELECT count
    FROM views;
  `;

  return views.reduce((acc, curr) => acc + Number(curr.count), 0);
}

export async function getViewsCount(postNum: number): Promise<
  { slug: string; count: number }[]
> {
  if (!process.env.POSTGRES_URL) {
    return [];
  }

  return sql`
    SELECT slug, count
    FROM views
    ORDER BY count DESC
    LIMIT ${postNum};
  `;
}

export async function getViewCount(slug: string): Promise<
  { slug: string; count: number }[]
> {
  if (!process.env.POSTGRES_URL) {
    return [];
  }

  return sql`
    SELECT slug, count
    FROM views
    WHERE slug=(${slug});
  `;
}

export async function getGuestbookEntries(): Promise<
  entryType[]
> {
  if (!process.env.POSTGRES_URL) {
    return [];
  }

  return sql`
    SELECT id, body, created_by, created_at, updated_at, email, color
    FROM guestbook
    ORDER BY created_at DESC
    LIMIT 300;
  `;
}

export async function getComments({ slug }: { slug: string }): Promise<
  commentType[]
> {
  if (!process.env.POSTGRES_URL) {
    return [];
  }
  
  return sql`
    SELECT id, body, created_by, created_at, updated_at, email
    FROM comments
    WHERE slug = (${slug})
    ORDER BY created_at DESC
    LIMIT 15;
  `;
}

export async function getEveryComment(): Promise<
  commentType[]
> {
  if (!process.env.POSTGRES_URL) {
    return [];
  }
  
  return sql`
    SELECT id, slug, body, created_by, created_at, updated_at, email
    FROM comments
    ORDER BY created_at DESC
    LIMIT 15;
  `;
}