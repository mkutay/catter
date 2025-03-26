'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { PostgresError } from 'postgres';

import { auth, getSession } from '@/lib/auth';
import { sql } from '@/lib/postgres';
import { CommentData } from '@/config/types';
import { siteConfig } from '@/config/site';
import { commentsFormSchema } from '@/config/schema';

export async function saveComment({ slug, message }: { slug: string, message: string }) {
  const session = await auth();
  
  if (!session || !session.user) {
    throw new Error('Unauthorized');
  }

  const random = Math.floor(Math.random() * 10000000);

  const validation = commentsFormSchema.safeParse({
    message,
  });

  if (!validation.success) {
    return {
      errors: validation.error.issues,
    };
  }

  const email = session.user?.email as string;
  const created_by = session.user?.name as string;

  try {
    await sql`
      INSERT INTO comments (id, slug, email, body, created_by, created_at)
      VALUES (${random}, ${slug}, ${email}, ${message}, ${created_by}, NOW())
    `;
  } catch (error) {
    if ((error as PostgresError).code === '42P01') {
      // Table does not exist, so create the table
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

      // Retry the insert after creating the table
      await sql`
        INSERT INTO comments (id, slug, email, body, created_by, created_at)
        VALUES (${random}, ${slug}, ${email}, ${message}, ${created_by}, NOW())
      `;
    } else {
      // Rethrow the error if it's not related to table existence
      throw error;
    }
  }

  revalidatePath(`/posts/${slug}`);
}

export async function deleteComment({ comment }: { comment: CommentData }) {
  let session = await getSession();
  let email = session.user?.email as string;

  if (!siteConfig.admins.includes(email) && comment.email !== email) {
    throw new Error('Unauthorized');
  }

  await sql`
    DELETE FROM comments
    WHERE id = (${comment.id})
  `;

  // revalidatePath(`/posts/${comment.slug}`);
  revalidateTag('nextjs-blog-comments');
}