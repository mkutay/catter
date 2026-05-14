"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Session } from "next-auth";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
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
  const { toast } = useToast();

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
      toast({
        title: "Error",
        description:
          "Could not save comment. Please try again later. " +
          saved.error.message,
        variant: "destructive",
      });
    } else {
      // Add the real comment returned from the server.
      editComment({ action: "add", newComment: saved.value[0] });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2"
      >
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Write a comment to this post!</FormLabel>
              <FormControl>
                <Textarea
                  className="h-32"
                  placeholder="Your comment..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-row gap-2 justify-end items-center">
          <SignOut callbackUrl={`/posts/${slug}#comments`} />
          <Button variant="default" size="default" type="submit">
            Post
          </Button>
        </div>
      </form>
    </Form>
  );
}
