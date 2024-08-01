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
import { SignOut } from '@/components/commentsButtons';
import { revalidatePost, saveComment } from '@/lib/dataBaseActions';
import { CommentsFormSchema } from '@/config/schema';

export function CommentForm({ slug }: { slug: string }) {
  const form = useForm<z.infer<typeof CommentsFormSchema>>({
    resolver: zodResolver(CommentsFormSchema),
    defaultValues: {
      message: "",
    },
  });
 
  const onSubmit = async (values: z.infer<typeof CommentsFormSchema>) => {
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
        <div className="flex flex-row gap-2 justify-between items-center">
          <Button type="button"  aria-label="Revalidate Comments" variant="ghost" size="icon" onClick={() => revalidatePost({ slug })}>
            <TbReload size="20px" strokeWidth="2.5px"/>
          </Button>
          <div className="flex flex-row gap-2 items-center">
            <SignOut/>
            <Button variant="default" size="default" type="submit">Post</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}