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
import { useToast } from '@/components/ui/use-toast';
import { GuestbookDialog } from '@/app/guestbook/dialog';
import { GuestBookSignOut } from '@/app/guestbook/buttons';
import { saveGuestbookEntryData } from '@/lib/database-actions/guestbook';
import { guestbookFormSchema } from '@/config/schema';

export default function GuestbookForm() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof guestbookFormSchema>>({
    resolver: zodResolver(guestbookFormSchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof guestbookFormSchema>) => {
    const saved = await saveGuestbookEntryData({
      message: values.message,
    });
    if (saved.code !== 'SUCCESS') {
      console.error(saved.message);
      toast({
        title: 'Error saving guestbook entry. Please try again later.',
        description: saved.message,
        variant: 'destructive',
      });
      return;
    }
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
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
      </form>
    </Form>
  );
}