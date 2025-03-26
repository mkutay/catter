'use server';

import { sql } from '@/lib/postgres';
import { doesPostWithSlugExist } from '@/lib/contentQueries';
import { ViewCount } from '@/config/types';

export async function getBlogViews(): Promise<number> {
  if (!process.env.POSTGRES_URL) {
    throw new Error('Postgres URL is not defined.');
  }

  const views = await sql<{ count: number }[]>`
    SELECT count
    FROM views;
  `;

  return views.reduce((acc, curr) => acc + Number(curr.count), 0);
}

export async function getViewsCount(postNum: number): Promise<ViewCount[]> {
  if (!process.env.POSTGRES_URL) {
    throw new Error('Postgres URL is not defined.');
  }

  if (postNum < 1 || postNum > 100) {
    throw new Error('Post number out of allowed range.');
  }

  return await sql<ViewCount[]>`
    SELECT slug, count
    FROM views
    ORDER BY count DESC
    LIMIT ${postNum};
  `;
}

export async function getViewCount(slug: string): Promise<ViewCount> {
  if (!process.env.POSTGRES_URL) {
    throw new Error('Postgres URL is not defined.');
  }

  if (!doesPostWithSlugExist(slug)) {
    throw new Error('Post does not exist.');
  }

  const views = await sql<ViewCount[]>`
    SELECT slug, count
    FROM views
    WHERE slug=(${slug});
  `;

  if (views.length !== 1) {
    throw new Error('Post does not exist.');
  }

  return views[0];
}