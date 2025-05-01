"use client";

import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';

import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { DeleteComment, SignIn } from '@/components/comments/commentsButtons';
import { CommentForm } from '@/components/comments/commentsForm';
import { getComments } from '@/lib/database-actions/comments';
import { siteConfig } from '@/config/site';
import { CommentData } from '@/config/types';
import { User } from 'next-auth';
import { getUser } from '@/lib/database-actions/auth';

export default function Comments({ slug }: { slug: string }) {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      const comments = await getComments({ slug });
      if (!comments.ok) {
        console.error(`Error fetching comments for ${slug}:`, comments.error.message);
        setComments([]);
      } else {
        setComments(comments.value);
      }
    };

    const fetchSession = async () => {
      const user = await getUser();
      setUser(user);
    }

    fetchSession();
    fetchComments();
    setIsLoading(false);
  }, [slug]);

  return (
    <div id="comments" className="w-full flex flex-col gap-8 mt-6">
      {user ? (
        <CommentForm slug={slug}/>
      ) : (
        <CommentAuth slug={slug}/>
      )}
      {isLoading ? <CommentsFallback /> : <div className="flex flex-col gap-6">
        {comments.map((comment) => (
          <Comment comment={comment} key={comment.id} owns={(user && siteConfig.admins.includes(user.email as string)) || (user && user.email == comment.email)} />
        ))}
      </div>}
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

export function Comment({
  comment,
  owns,
}: {
  comment: CommentData;
  owns?: boolean | null;
}) {
  return (
    <div id={comment.id} className="flex flex-col gap-2 w-full">
      <Label htmlFor="user">{`${comment.created_by} on ${format(comment.created_at, 'PP')}`}</Label>
      <div className="border border-border shadow-sm rounded-md px-3 py-2">
        {comment.body}
      </div>
      {owns && (
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