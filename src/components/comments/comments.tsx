"use client";

import { format } from "date-fns";
import type { Session } from "next-auth";
import { useCallback, useEffect, useState } from "react";
import { DeleteComment } from "@/components/comments/delete";
import { CommentForm } from "@/components/comments/form";
import { TypographySmall } from "@/components/typography/paragraph";
import { Label } from "@/components/ui/label";
import { siteConfig } from "@/config/site";
import type { CommentData } from "@/config/types";
import { getSessionAction } from "@/lib/server-helper";
import { SignIn } from "../auth-buttons";
import { TypographyHr } from "../typography/blockquote";
import type { CommentActionProps } from "./types";

/**
 * The main Comments component that handles fetching, displaying,
 * and managing comments for a given post slug.
 */
export function Comments({ slug }: { slug: string }) {
  const [comments, setComments] = useState<CommentData[]>([]);

  /**
   * The authenticated session.
   *
   * `undefined` is the initial state before the session is loaded.
   * `null` indicates the user is not authenticated.
   */
  const [session, setSession] = useState<Session | null | undefined>(undefined);

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
    setSession(undefined);

    getSessionAction().then((session) => {
      if (ignore) return;
      if (session.ok) setSession(session.value);
      else setSession(null);
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

  const sessionEmail = session?.user?.email ?? "";

  return (
    <>
      <TypographyHr className="my-12" />
      <div id="comments" className="w-full flex flex-col gap-8">
        {session ? (
          <CommentForm
            slug={slug}
            editComment={editComment}
            session={session}
          />
        ) : (
          session === null && (
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
                {(siteConfig.admins.includes(sessionEmail) ||
                  sessionEmail === comment.email) && (
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
