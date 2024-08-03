'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { TbReload } from 'react-icons/tb';

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
import { SignOut } from '@/components/comments/commentsButtons';
import { saveComment } from '@/lib/dataBaseActions';
import { commentsFormSchema } from '@/config/schema';

export function CommentForm({ slug }: { slug: string }) {
  const form = useForm<z.infer<typeof commentsFormSchema>>({
    resolver: zodResolver(commentsFormSchema),
    defaultValues: {
      message: "",
    },
  });
 
  const onSubmit = async (values: z.infer<typeof commentsFormSchema>) => {
    await saveComment({ slug, message: values.message });
    form.reset();
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
                <Textarea className="h-32" placeholder="Your comment..." {...field}/>
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <div className="flex flex-row gap-2 justify-end items-center">
          <SignOut/>
          <Button variant="default" size="default" type="submit">Post</Button>
        </div>
      </form>
    </Form>
  );
}