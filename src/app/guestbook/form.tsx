"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { SignOut } from "@/components/auth-buttons";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { guestbookFormSchema } from "@/config/schema";
import { saveGuestbookEntryAction } from "@/lib/server-helper";
import { GuestbookDialog } from "./dialog";

/**
 * A client-side form for submitting a simple guestbook entry.
 *
 * Includes a message input, a "Sign!" button, and a link to a customization dialog.
 */
export default function GuestbookForm() {
  const form = useForm<z.infer<typeof guestbookFormSchema>>({
    resolver: zodResolver(guestbookFormSchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof guestbookFormSchema>) => {
    const saved = await saveGuestbookEntryAction({
      message: values.message,
    });
    if (!saved.ok) {
      toast.error("Error saving guestbook entry. Please try again later.", {
        description: saved.error.message,
      });
      return;
    }
    form.reset();
  };

  return (
    <div className="flex flex-col gap-2">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-row gap-2"
      >
        <Controller
          control={form.control}
          name="message"
          render={({ field, fieldState }) => (
            <Field className="w-full" data-invalid={!!fieldState.error}>
              <Input
                aria-label="Your message"
                placeholder="Your message..."
                aria-invalid={!!fieldState.error}
                {...field}
              />
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />
        <Button variant="default" size="md" type="submit">
          Sign!
        </Button>
      </form>
      <div className="w-fit flex flex-row gap-2 items-center">
        <GuestbookDialog />
        <SignOut className="w-fit" />
      </div>
    </div>
  );
}

/**
 * Fallback component for the GuestbookForm displayed during loading.
 */
export function GuestBookFormFallback() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-9 w-54" />
    </div>
  );
}
