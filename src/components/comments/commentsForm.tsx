'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { SignOut } from '@/components/comments/commentsButtons';
import { commentsFormSchema } from '@/config/schema';
import { CommentData } from '@/config/types';
import Server from '@/lib/server';

export function CommentForm({ 
  slug,
  editComment,
  user,
}: { 
  slug: string; 
  editComment: (props: {
    action: "add";
    newComment: CommentData;
  } | {
    action: "delete";
    commentId: string;
  }) => void;
  user: { email: string; name: string };
}) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof commentsFormSchema>>({
    resolver: zodResolver(commentsFormSchema),
    defaultValues: {
      message: "",
    },
  });
 
  const onSubmit = async (values: z.infer<typeof commentsFormSchema>) => {
    const now = new Date().toDateString();
    const optimisticComment: CommentData = {
      id: Math.random() * 1000000 + "",
      body: values.message,
      created_at: now,
      updated_at: now,
      email: user.email,
      created_by: user.name,
      slug: slug,
    };
    
    editComment({ action: 'add', newComment: optimisticComment });
    
    form.reset();
    
    const saved = await Server.Comments.Save({ slug, message: values.message });

    editComment({ action: 'delete', commentId: optimisticComment.id });

    if (!saved.ok) {
      toast({
        title: "Error",
        description: "Could not save comment. Please try again later.",
        variant: "destructive",
      });
    } else {
      editComment({ action: 'add', newComment: saved.value[0] });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Write a Comment to this Post!</FormLabel>
              <FormControl>
                <Textarea className="h-32" placeholder="Your comment..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-row gap-2 justify-end items-center">
          <SignOut slug={slug} />
          <Button variant="default" size="default" type="submit">Post</Button>
        </div>
      </form>
    </Form>
  );
}