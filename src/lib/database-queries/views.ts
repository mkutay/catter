'use server';

import { sql } from '@/lib/postgres';
import { doesPostWithSlugExist } from '@/lib/contentQueries';
import { ViewCount } from '@/config/types';

export async function getBlogViews(): Promise<number> {
  const views = await sql<{ count: number }[]>`
    SELECT count
    FROM views;
  `;

  return views.reduce((acc, curr) => acc + Number(curr.count), 0);
}

export async function getViewsCount(postNum: number): Promise<ViewCount[]> {
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

export async function getViewCount(slug: string): Promise<number> {
  if (!doesPostWithSlugExist(slug)) {
    throw new Error('Post does not exist.');
  }

  const views = await sql<ViewCount[]>`
    SELECT slug, count
    FROM views
    WHERE slug=(${slug});
  `;

  if (views.length !== 1) {
    console.error(`Post does not exist in views table on slug ${slug}`);
    return 0;
  }

  return views[0].count;
}