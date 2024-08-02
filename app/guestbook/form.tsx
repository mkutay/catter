'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { saveGuestbookEntry } from '@/lib/dataBaseActions';
import { GuestbookFormSchema } from '@/config/schema';

export default function GuestbookZodForm() {
  const form = useForm<z.infer<typeof GuestbookFormSchema>>({
    resolver: zodResolver(GuestbookFormSchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof GuestbookFormSchema>) => {
    await saveGuestbookEntry({
      message: values.message,
    });
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-row gap-2">
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  aria-label="Your message"
                  placeholder="Your message..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          variant="secondary"
          size="md"
          type="submit"
        >
          Sign!
        </Button>
      </form>
    </Form>
  );
}