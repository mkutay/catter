"use client";

import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { DeleteComment, SignIn } from "@/components/comments/commentsButtons";
import { CommentForm } from "@/components/comments/commentsForm";
import { TypographySmall } from "@/components/typography/paragraph";
import { Label } from "@/components/ui/label";
import { siteConfig } from "@/config/site";
import type { CommentData } from "@/config/types";
import { getUser } from "@/lib/server-helper";
import { TypographyHr } from "../typography/blockquote";

export default function Comments({ slug }: { slug: string }) {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [user, setUser] = useState<
    { email: string; name: string } | null | undefined
  >(undefined);

  useEffect(() => {
    let ignore = false;
    setComments([]);

    fetch(`/api/comments?slug=${slug}`)
      .then((data) => data.json())
      .then((comments) => {
        if (ignore) return;
        setComments(comments);
      })
      .catch(() => {
        if (ignore) return;
        setComments([]);
      });

    return () => {
      ignore = true;
    };
  }, [slug]);

  useEffect(() => {
    let ignore = false;
    setUser(undefined);

    getUser().then((user) => {
      if (ignore) return;
      setUser(user);
    });

    return () => {
      ignore = true;
    };
  }, []);

  const editComment = useCallback(
    (
      props:
        | {
            action: "add";
            newComment: CommentData;
          }
        | {
            action: "delete";
            commentId: number;
          },
    ) => {
      if (props.action === "add") {
        setComments((prevComments) => [props.newComment, ...prevComments]);
      } else if (props.action === "delete") {
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== props.commentId),
        );
      }
    },
    [],
  );

  return (
    <>
      <TypographyHr className="my-12" />
      <div id="comments" className="w-full flex flex-col gap-8">
        {user ? (
          <CommentForm slug={slug} editComment={editComment} user={user} />
        ) : (
          user === null && <CommentAuth slug={slug} />
        )}
        {comments.length !== 0 && (
          <div className="flex flex-col gap-8">
            {comments.map((comment) => (
              <Comment
                comment={comment}
                key={comment.id}
                owns={
                  siteConfig.admins.includes(user?.email || "") ||
                  user?.email === comment.email
                }
                editComment={editComment}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export function CommentAuth({ slug }: { slug: string }) {
  return (
    <div className="flex flex-col gap-2">
      <SignIn slug={slug} />
      <TypographySmall className="font-sans">
        Sign in to write a comment!
      </TypographySmall>
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
  editComment?: (
    props:
      | {
          action: "add";
          newComment: CommentData;
        }
      | {
          action: "delete";
          commentId: number;
        },
  ) => void;
}) {
  return (
    <div id={comment.id.toString()} className="flex flex-col gap-2 w-full">
      <Label>{`${comment.createdBy} on ${format(comment.createdAt, "PP")}`}</Label>
      <div className="border border-border shadow-xs rounded-md px-3 py-2">
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
