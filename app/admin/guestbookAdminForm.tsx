'use client';

import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { deleteAdmins, deleteGuestbookEntries } from '@/lib/dataBaseActions';
import { entryMeta } from '@/config/site';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function GuestbookAdminForm({ entries }: { entries: entryMeta[] }) {
  const deleteGuestbookEntryFormSchema = z.object({
    items: z.array(z.string()).refine((value) => value.some((item) => item), {
      message: 'You have to select at least one item.',
    }),
  });

  const form = useForm<z.infer<typeof deleteGuestbookEntryFormSchema>>({
    resolver: zodResolver(deleteGuestbookEntryFormSchema),
    defaultValues: {
      items: [],
    },
  });
  
  const onSubmit = async (values: z.infer<typeof deleteGuestbookEntryFormSchema>) => {
    await deleteGuestbookEntries(values.items);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="items"
          render={() => (
            <FormItem>
              <FormLabel className="text-foreground">Delete Entries</FormLabel>
              <FormDescription>
                Delete the entries that you do not want on guestbook.
              </FormDescription>
              {entries.map((entry) => (
                <FormField
                  key={entry.id}
                  control={form.control}
                  name="items"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={entry.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            id={entry.id}
                            className="mt-[3px]"
                            checked={field.value?.includes(entry.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, entry.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== entry.id
                                    )
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          <div className="break-words">
                            <span className={cn("mr-1 font-bold tracking-tight", (entry.color === '' || entry.color === null) ? 'text-foreground' : `text-${entry.color}`)}>
                              {entry.created_by}:
                            </span>
                            <span className="text-foreground">
                              {entry.body}
                            </span>
                          </div>
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-row items-center not-prose gap-2">
          <Button type="submit" size="default" variant="destructive">Delete Entries</Button>
          <Button asChild variant="ghost" size="default">
            <Link href="/guestbook">
              Return to Guest Book
            </Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}