'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { PostgresError } from 'postgres';
import { connection } from 'next/server';

import { auth } from '@/lib/auth';
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
    throw new Error('Invalid comment: ' + validation.error.issues);
  }

  const email = session.user.email as string;
  const created_by = session.user.name as string;

  await insertIntoComments(random, slug, email, message, created_by);

  revalidatePath(`/posts/${slug}`);
}

export async function deleteComment({ comment }: { comment: CommentData }) {
  const session = await auth();
  
  if (!session || !session.user) {
    throw new Error('Unauthorized');
  }

  const email = session.user.email as string;

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

async function insertIntoComments(random: number, slug: string, email: string, message: string, created_by: string) {
  await sql`
    INSERT INTO comments (id, slug, email, body, created_by, created_at)
    VALUES (${random}, ${slug}, ${email}, ${message}, ${created_by}, NOW())
  `;
}