"use client";

import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';

import { Label } from '@/components/ui/label';
import { TypographyLarge } from '@/components/typography/paragraph';
import { DeleteComment, SignIn } from '@/components/comments/commentsButtons';
import { CommentForm } from '@/components/comments/commentsForm';
import { getComments } from '@/lib/database-actions/comments';
import { getUserEmail } from '@/lib/database-actions/auth';
import { siteConfig } from '@/config/site';
import { CommentData } from '@/config/types';

export default function Comments({ slug }: { slug: string }) {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      const comments = await getComments({ slug });
      setComments(comments.ok ? comments.value : []);
      setIsLoading(false);
    };

    const fetchSession = async () => {
      const email = await getUserEmail();
      setEmail(email);
      setIsLoading(false);
    }

    fetchSession();
    fetchComments();
  }, [slug]);

  if (isLoading) return <div id="comments" />;

  return (
    <div id="comments" className="w-full flex flex-col gap-8 mt-6">
      {email ? (
        <CommentForm slug={slug}/>
      ) : (
        <CommentAuth slug={slug}/>
      )}
      <div className="flex flex-col gap-6">
        {comments.map((comment) => (
          <Comment comment={comment} key={comment.id} owns={(siteConfig.admins.includes(email as string)) || (email == comment.email)} />
        ))}
      </div>
    </div>
  );
}

export function CommentAuth({ slug }: { slug: string }) {
  return (
    <div className="flex flex-col gap-1 items-center">
      <TypographyLarge className="text-primary">Sign in to write a comment!</TypographyLarge>
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