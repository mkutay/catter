import { exit } from 'process';

import { sql } from '@/lib/postgres';

try {
  // Create posts table
  await sql`
    CREATE TABLE IF NOT EXISTS posts (
      slug VARCHAR(255) PRIMARY KEY,
      content TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      date TIMESTAMP NOT NULL,
      excerpt TEXT NOT NULL,
      locale TEXT NOT NULL,
      cover TEXT,
      coverSquare TEXT,
      lastModified TIMESTAMP NOT NULL,
      shortened VARCHAR(255) NOT NULL,
      shortExcerpt TEXT
    )
  `;

  // Create keywords table
  await sql`
    CREATE TABLE IF NOT EXISTS post_keywords (
      slug VARCHAR(255),
      keyword TEXT,
      PRIMARY KEY (slug, keyword),
      FOREIGN KEY (slug) REFERENCES posts(slug) ON DELETE CASCADE ON UPDATE CASCADE
    )
  `;

  // Create tags table
  await sql`
    CREATE TABLE IF NOT EXISTS post_tags (
      slug VARCHAR(255),
      tag TEXT,
      PRIMARY KEY (slug, tag),
      FOREIGN KEY (slug) REFERENCES posts(slug) ON DELETE CASCADE ON UPDATE CASCADE
    )
  `;

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
      count INT NOT NULL DEFAULT 0,
      FOREIGN KEY (slug) REFERENCES posts(slug) ON DELETE CASCADE ON UPDATE CASCADE
    );
  `;

  const slugs = await sql<{ slug: string }[]>`
    SELECT slug
    FROM posts;
  `;
  
  await Promise.all(slugs.map((v) =>
    sql`
      INSERT INTO views (slug, count)
      VALUES (${v.slug}, 0)
      ON CONFLICT (slug) DO NOTHING;
    `
  ));

  console.log('Database tables successfully created and/or updated.');
} catch (error) {
  // Log error but don't fail the build
  console.log('Database connection failed, skipping table operations:', error);
}

exit(0);