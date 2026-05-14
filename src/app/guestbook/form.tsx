"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { SignOut } from "@/components/auth-buttons";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { guestbookFormSchema } from "@/config/schema";
import { saveGuestbookEntryAction } from "@/lib/server-helper";
import { GuestbookDialog } from "./dialog";

/**
 * A client-side form for submitting a simple guestbook entry.
 *
 * Includes a message input, a "Sign!" button, and a link to a customization dialog.
 */
export default function GuestbookForm() {
  const { toast } = useToast();

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
      toast({
        title: "Error saving guestbook entry. Please try again later.",
        description: saved.error.message,
        variant: "destructive",
      });
      return;
    }
    form.reset();
  };

  return (
    <div className="flex flex-col gap-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-row gap-2"
        >
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
          <Button variant="default" size="md" type="submit">
            Sign!
          </Button>
        </form>
        <div className="w-fit flex flex-row gap-2 items-center">
          <GuestbookDialog />
          <SignOut className="w-fit" />
        </div>
      </Form>
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
