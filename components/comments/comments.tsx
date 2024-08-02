import { micromark } from 'micromark';
import { format } from 'date-fns';
import { gfm, gfmHtml } from 'micromark-extension-gfm';
import { math, mathHtml } from 'micromark-extension-math';
import parse from 'html-react-parser';

import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { DeleteComment, SignIn } from '@/components/comments/commentsButtons';
import { CommentForm } from '@/components/comments/commentsForm';
import { auth } from '@/lib/auth';
import { getComments, isAdmin } from '@/lib/dataBaseQueries';
import { commentMeta } from '@/config/site';
import React from 'react';

export default async function Comments({ slug }: { slug: string }) {
  const session = await auth();
  const comments: commentMeta[] = await getComments({ slug });

  return (
    <div id="comments" className="w-full flex flex-col gap-8 mt-6">
      {session?.user ? (
        <CommentForm slug={slug}/>
      ) : (
        <CommentAuth slug={slug}/>
      )}
      <div className="flex flex-col gap-6">
        {comments.map((comment) => (
          <Comment comment={comment} key={comment.id}/>
        ))}
      </div>
    </div>
  );
}

export function CommentAuth({ slug }: { slug: string }) {
  return (
    <div className="flex flex-col gap-2">
      <Label>Sign in to Write a Comment:</Label>
      <SignIn slug={slug}/>
    </div>
  );
}

export async function Comment({ comment }: { comment: commentMeta }) {
  const session = await auth();
  
  const admin = session && session.user && (await isAdmin(session.user?.email as string));
  const isUsers = session && session.user && session.user.email == comment.email;

  return (
    <div id={comment.id} className="flex flex-col gap-2 w-full">
      <Label htmlFor="user">{`${comment.created_by} on ${format(comment.created_at, 'PP')}`}</Label>
      <div className="border border-border shadow-sm rounded-md px-3 py-2 prose-p:my-2">
        {parse(micromark(comment.body, {
          extensions: [gfm(), math()],
          htmlExtensions: [gfmHtml(), mathHtml()],
        }))}
      </div>
      {(admin || isUsers) && (
        <div className="flex flex-row justify-end">
          <DeleteComment comment={comment}/>
        </div>
      )}
    </div>
  );
}

export function CommentsFallback() {
  const comments: React.ReactNode[] = [];

  for (let i = 0; i < 3; i++) {
    comments.push(
      <div key={i} className="flex flex-col gap-2">
        <Skeleton className="h-8 w-2/5"/>
        <Skeleton className="h-20 w-full"/>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {comments}
    </div>
  );
}