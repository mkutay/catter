"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
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
      toast.error("Error deleting entries.", {
        description: deleted.error.message,
      });
      return;
    } else {
      toast.success("Entries deleted.", {
        description: "The selected entries have been deleted successfully.",
      });
    }
    form.reset();
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        control={form.control}
        name="items"
        render={({ field, fieldState }) => (
          <Field data-invalid={!!fieldState.error} className="gap-2">
            <FieldLabel className="text-foreground">Delete Entries</FieldLabel>
            <FieldDescription>
              Delete the entries that you do not want on guestbook.
            </FieldDescription>
            <FieldGroup data-slot="checkbox-group" className="gap-2">
              {entries.map((entry) => (
                <Field
                  key={entry.id}
                  orientation="horizontal"
                  className="items-start gap-3"
                >
                  <Checkbox
                    id={entry.id.toString()}
                    className="mt-1"
                    checked={field.value?.includes(entry.id)}
                    onCheckedChange={(checked) => {
                      return checked
                        ? field.onChange([...field.value, entry.id])
                        : field.onChange(
                            field.value?.filter((value) => value !== entry.id),
                          );
                    }}
                  />
                  <FieldLabel
                    htmlFor={entry.id.toString()}
                    className="text-md font-normal leading-normal"
                  >
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
                      <span className="text-foreground">{entry.body}</span>
                    </div>
                  </FieldLabel>
                </Field>
              ))}
            </FieldGroup>
            {fieldState.error && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </Field>
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
  );
}
