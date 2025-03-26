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
import { GuestbookDialog } from '@/app/guestbook/dialog';
import { GuestBookSignOut } from '@/app/guestbook/buttons';
import { saveGuestbookEntry } from '@/lib/dataBaseActions';
import { guestbookFormSchema } from '@/config/schema';

export default function GuestbookForm() {
  const form = useForm<z.infer<typeof guestbookFormSchema>>({
    resolver: zodResolver(guestbookFormSchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof guestbookFormSchema>) => {
    await saveGuestbookEntry({
      message: values.message,
    });
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
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
      </form>
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-2 items-center">
          <GuestbookDialog/>
          <GuestBookSignOut/>
        </div>
        <Button
          variant="default"
          size="default"
          type="submit"
        >
          Sign!
        </Button>
      </div>
    </Form>
  );
}