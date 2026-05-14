"use client";

import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { DeleteComment } from "@/components/comments/delete";
import { CommentForm } from "@/components/comments/form";
import { TypographySmall } from "@/components/typography/paragraph";
import { Label } from "@/components/ui/label";
import { siteConfig } from "@/config/site";
import type { CommentData } from "@/config/types";
import { getUser } from "@/lib/server-helper";
import { SignIn } from "../auth-buttons";
import { TypographyHr } from "../typography/blockquote";
import type { CommentActionProps } from "./types";

/**
 * The main Comments component that handles fetching, displaying,
 * and managing comments for a given post slug.
 */
export function Comments({ slug }: { slug: string }) {
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

  /**
   * Updates the comments list based on actions (add or delete).
   *
   * This is passed down to child components to allow optimistic
   * updates and state synchronisation.
   */
  const editComment = useCallback((props: CommentActionProps) => {
    if (props.action === "add") {
      setComments((prevComments) => [props.newComment, ...prevComments]);
    } else if (props.action === "delete") {
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== props.commentId),
      );
    }
  }, []);

  return (
    <>
      <TypographyHr className="my-12" />
      <div id="comments" className="w-full flex flex-col gap-8">
        {user ? (
          <CommentForm slug={slug} editComment={editComment} user={user} />
        ) : (
          user === null && (
            <div className="flex flex-col gap-2">
              <SignIn callbackUrl={`/posts/${slug}#comments`} />
              <TypographySmall className="font-sans">
                Sign in to write a comment!
              </TypographySmall>
            </div>
          )
        )}

        {comments.length !== 0 && (
          <div className="flex flex-col gap-8">
            {comments.map((comment) => (
              <div
                id={comment.id.toString()}
                className="flex flex-col gap-2 w-full"
                key={comment.id}
              >
                <Label>{`${comment.createdBy} on ${format(comment.createdAt, "PP")}`}</Label>
                <div className="border border-border shadow-xs rounded-md px-3 py-2">
                  {comment.body}
                </div>

                {/* Show delete button if the current user owns the comment or is an admin. */}
                {(siteConfig.admins.includes(user?.email ?? "") ||
                  user?.email === comment.email) && (
                  <div className="flex flex-row justify-end">
                    <DeleteComment
                      comment={comment}
                      editComment={editComment}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
