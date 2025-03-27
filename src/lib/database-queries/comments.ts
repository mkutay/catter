'use server';

import { doesPostWithSlugExist } from '@/lib/contentQueries';
import { sql } from '@/lib/postgres';
import { CommentData } from '@/config/types';

/* Limiting to 15 to avoid loading too many comments at once. */

export async function getComments({ slug }: { slug: string }): Promise<CommentData[]> {
  if (!process.env.POSTGRES_URL) {
    throw new Error('Postgres database URL not found.');
  }

  if (!doesPostWithSlugExist(slug)) {
    throw new Error(`Post not found.`);
  }

  return sql<CommentData[]>`
    SELECT id, body, created_by, created_at, updated_at, email
    FROM comments
    WHERE slug = (${slug})
    ORDER BY created_at DESC
    LIMIT 15;
  `;
}

export async function getEveryComment(limit?: number): Promise<CommentData[]> {
  if (!process.env.POSTGRES_URL) {
    throw new Error('Postgres database URL not found.');
  }

  limit = limit || 15;

  if (limit <= 0 || limit > 100) {
    throw new Error('Limit out of allowed range.');
  }

  return sql<CommentData[]>`
    SELECT id, slug, body, created_by, created_at, updated_at, email
    FROM comments
    ORDER BY created_at DESC
    LIMIT ${limit};
  `;
}