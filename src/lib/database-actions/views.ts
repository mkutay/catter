'use server';

import { PostgresError } from 'postgres';
import { connection } from 'next/server';

import { auth } from '@/lib/auth';
import { sql } from '@/lib/postgres';
import { siteConfig } from '@/config/site';

export async function incrementViews(slug: string) {
  await connection();

  let session = await auth();

  if (session && session.user && siteConfig.admins.includes(session.user?.email as string)) {
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