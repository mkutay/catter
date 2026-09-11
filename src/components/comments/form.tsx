"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Session } from "next-auth";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { commentsFormSchema } from "@/config/schema";
import type { CommentData } from "@/config/types";
import { saveCommentAction } from "@/lib/server-helper";
import { SignOut } from "../auth-buttons";
import type { CommentActionProps } from "./types";

/**
 * Form component for submitting new comments.
 *
 * Features optimistic updates: displays the comment immediately
 * and then synchronises with the server.
 */
export function CommentForm({
  slug,
  editComment,
  session,
}: {
  slug: string;
  editComment: (props: CommentActionProps) => void;
  session: Session;
}) {
  const form = useForm<z.infer<typeof commentsFormSchema>>({
    resolver: zodResolver(commentsFormSchema),
    defaultValues: {
      message: "",
    },
  });

  const sessionEmail = session?.user?.email ?? "";
  const sessionName = session?.user?.name ?? "Anonymous";

  const onSubmit = async (values: z.infer<typeof commentsFormSchema>) => {
    const now = new Date().toDateString();

    // Create a temporary "optimistic" comment to show in the UI immediately.
    const optimisticComment = {
      id: Math.floor(Math.random() * 10000000),
      body: values.message,
      createdAt: now,
      updatedAt: now,
      email: sessionEmail,
      createdBy: sessionName,
      slug: slug,
    } as CommentData;

    // Add the optimistic comment to the list.
    editComment({ action: "add", newComment: optimisticComment });

    form.reset();

    const saved = await saveCommentAction({ slug, message: values.message });

    // Remove the optimistic comment regardless of success,
    // it will be replaced by the real one on success.
    editComment({ action: "delete", commentId: optimisticComment.id });

    if (!saved.ok) {
      toast.error(
        `Could not save comment. Please try again later. ${saved.error.message}`,
      );
    } else {
      // Add the real comment returned from the server.
      editComment({ action: "add", newComment: saved.value[0] });
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-2"
    >
      <Controller
        control={form.control}
        name="message"
        render={({ field, fieldState }) => (
          <Field data-invalid={!!fieldState.error} className="gap-2">
            <FieldLabel htmlFor={field.name}>
              Write a comment to this post!
            </FieldLabel>
            <Textarea
              id={field.name}
              className="h-32"
              placeholder="Your comment..."
              aria-invalid={!!fieldState.error}
              {...field}
            />
            {fieldState.error && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </Field>
        )}
      />
      <div className="flex flex-row gap-2 justify-end items-center">
        <SignOut callbackUrl={`/posts/${slug}#comments`} />
        <Button variant="default" size="default" type="submit">
          Post
        </Button>
      </div>
    </form>
  );
}
