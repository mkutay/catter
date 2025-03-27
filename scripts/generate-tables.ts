import fs from 'fs';
import path from 'path';
import { exit } from 'process';

import { sql } from '@/lib/postgres';

function getPostFiles() {
  return fs.readdirSync(path.join(process.cwd(), 'content/posts'), 'utf-8');
}

try {
  // Create guestbook table
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

  // Create comments table
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

  // Create views table
  await sql`
    CREATE TABLE IF NOT EXISTS views (
      slug TEXT PRIMARY KEY,
      count INT NOT NULL
    );
  `;

  // Create slugs in the views table, if not already present
  const slugs = getPostFiles().map(file => file.replace('.mdx', ''));

  const existingSlugs = await sql`
    SELECT slug
    FROM views;
  `;

  const existingSlugsSet = new Set(existingSlugs.map((row) => row.slug));
  const newSlugs = slugs.filter((slug) => !existingSlugsSet.has(slug));
  if (newSlugs.length > 0) {
    const values = newSlugs.map((slug) => ({ slug, count: 0 }));
    await sql`
      INSERT INTO views (slug, count)
      VALUES ${sql(values)}
      ON CONFLICT (slug) DO NOTHING;
    `;
  }
  console.log('Database tables successfully created and/or updated.');
} catch (error) {
  // Log error but don't fail the build
  console.log('Database connection failed, skipping table operations:', error);
}

exit(0);