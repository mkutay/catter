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
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { SignOut } from '@/components/commentsButtons';
import { revalidatePost, saveComment } from '@/lib/dataBaseActions';

const formSchema = z.object({
  message: z.string().min(1).max(1000),
});

export function CommentForm({ slug }: { slug: string }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });
 
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    saveComment({ slug, message: values.message });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Write a Comment to this Post!</FormLabel>
              <FormControl>
                <Textarea className="h-32"  placeholder="Your comment..." {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex flex-row gap-2 justify-between items-center">
          <Button variant="ghost" size="icon" onClick={() => revalidatePost({ slug })}>
            <TbReload size="24px" strokeWidth="2.5px"/>
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