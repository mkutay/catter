"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import type z from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { deleteGuestbookEntryDataFormSchema } from "@/config/schema";
import type { EntryData } from "@/config/types";
import { deleteGuestbookEntriesAction } from "@/lib/server-helper";
import { cn } from "@/lib/utils";

/**
 * Admin form for managing guestbook entries.
 *
 * Allows admins to select and delete multiple entries from the guestbook.
 *
 * @param props.entries The list of guestbook entries to manage.
 */
export function GuestbookAdminForm({ entries }: { entries: EntryData[] }) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof deleteGuestbookEntryDataFormSchema>>({
    resolver: zodResolver(deleteGuestbookEntryDataFormSchema),
    defaultValues: {
      items: [],
    },
  });

  const onSubmit = async (
    values: z.infer<typeof deleteGuestbookEntryDataFormSchema>,
  ) => {
    const deleted = await deleteGuestbookEntriesAction({
      entries: values.items,
    });
    if (!deleted.ok) {
      toast({
        title: "Error deleting entries.",
        description: deleted.error.message,
        variant: "destructive",
      });
      return;
    } else {
      toast({
        title: "Entries deleted.",
        description: "The selected entries have been deleted successfully.",
        variant: "default",
      });
    }
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                            id={entry.id.toString()}
                            className="mt-1"
                            checked={field.value?.includes(entry.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, entry.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== entry.id,
                                    ),
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-md font-normal">
                          <div className="wrap-break-word">
                            <span
                              className={cn(
                                "mr-1 font-bold tracking-tight",
                                entry.color === "" || entry.color === null
                                  ? "text-foreground"
                                  : `text-${entry.color}`,
                              )}
                            >
                              {entry.createdBy}:
                            </span>
                            <span className="text-foreground">
                              {entry.body}
                            </span>
                          </div>
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-row items-center gap-2">
          <Button type="submit" size="default" variant="destructive">
            Delete Entries
          </Button>
          <Button asChild variant="ghost" size="default">
            <Link href="/guestbook">Return to Guest Book</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}
