'use server';

import { sql } from '@/lib/postgres';
import { CommentData, EntryData } from '@/config/types';
import { connection } from 'next/server';


export async function getBlogViews() {
  if (!process.env.POSTGRES_URL) {
    return [];
  }

  await connection();
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