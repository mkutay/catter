'use server';

import { connection } from 'next/server';

import { auth } from '@/lib/auth';
import { sql } from '@/lib/postgres';
import { siteConfig } from '@/config/site';

export async function incrementViews(slug: string) {
  await connection();

  let session = await auth();

  if (session && session.user && siteConfig.admins.includes(session.user.email as string)) {
    return;
  }
  
  await insertIntoViews(slug);
}

async function insertIntoViews(slug: string) {
  await sql`
    INSERT INTO views (slug, count)
    VALUES (${slug}, 1)
    ON CONFLICT (slug)
    DO UPDATE SET count = views.count + 1
  `;
}