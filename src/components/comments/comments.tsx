"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';

import { Label } from '@/components/ui/label';
import { TypographyLarge } from '@/components/typography/paragraph';
import { DeleteComment, SignIn } from '@/components/comments/commentsButtons';
import { CommentForm } from '@/components/comments/commentsForm';
import { siteConfig } from '@/config/site';
import { CommentData } from '@/config/types';
import Server from '@/lib/server';

export default function Comments({ slug }: { slug: string }) {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [user, setUser] = useState<{ email: string, name: string } | null | undefined>(undefined);

  useEffect(() => {
    let ignore = false;
    setComments([]);

    Server.Comments.Get({ slug }).then((comments) => {
      if (ignore) return;
      setComments(comments.ok ? comments.value : []);
    });

    return () => {
      ignore = true;
    };
  }, [slug]);

  useEffect(() => {
    let ignore = false;
    setUser(undefined);

    Server.Auth.User().then((user) => {
      if (ignore) return;
      setUser(user);
    });

    return () => {
      ignore = true;
    };
  }, []);

  const editComment = useCallback((props: {
    action: 'add',
    newComment: CommentData,
  } | {
    action: 'delete',
    commentId: string,
  }) => {
    if (props.action === 'add') {
      setComments(prevComments => [props.newComment, ...prevComments]);
    } else if (props.action === 'delete') {
      setComments(prevComments => prevComments.filter(comment => comment.id !== props.commentId));
    }
  }, [])

  return (
    <div id="comments" className="w-full flex flex-col gap-8 mt-6">
      {user ? (
        <CommentForm slug={slug} editComment={editComment} user={user} />
      ) : user === null && (
        <CommentAuth slug={slug} />
      )}
      {comments.length !== 0 && <div className="flex flex-col gap-6">
        {comments.map((comment) => (
          <Comment 
            comment={comment} 
            key={comment.id} 
            owns={(siteConfig.admins.includes(user?.email || '')) || (user?.email === comment.email)}
            editComment={editComment}
          />
        ))}
      </div>}
    </div>
  );
}

export function CommentAuth({ slug }: { slug: string }) {
  return (
    <div className="flex flex-col gap-1 items-center">
      <TypographyLarge className="text-primary">Sign in to write a comment!</TypographyLarge>
      <SignIn slug={slug} />
    </div>
  );
}

export function Comment({
  comment,
  owns,
  editComment,
}: {
  comment: CommentData;
  owns?: boolean | null;
  editComment?: (props: {
    action: "add";
    newComment: CommentData;
  } | {
    action: "delete";
    commentId: string;
  }) => void;
}) {
  return (
    <div id={comment.id} className="flex flex-col gap-2 w-full">
      <Label>{`${comment.created_by} on ${format(comment.created_at, 'PP')}`}</Label>
      <div className="border border-border shadow-sm rounded-md px-3 py-2">
        {comment.body}
      </div>
      {owns && (
        <div className="flex flex-row justify-end">
          <DeleteComment comment={comment} editComment={editComment} />
        </div>
      )}
    </div>
  );
}