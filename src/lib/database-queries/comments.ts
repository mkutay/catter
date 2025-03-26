'use server';

import { sql } from '@/lib/postgres';
import { CommentData } from '@/config/types';

export async function getComments({ slug }: { slug: string }): Promise<
  CommentData[]
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
  CommentData[]
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