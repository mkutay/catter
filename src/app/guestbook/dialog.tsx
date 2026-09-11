"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { guestbookDialogFormSchema } from "@/config/schema";
import { guestbookColors } from "@/config/types";
import { saveGuestbookEntryAction } from "@/lib/server-helper";
import { cn } from "@/lib/utils";

/**
 * A dialog component that allows users to customise their guestbook entry.
 *
 * Users can choose a colour, specify a custom username, and write a message.
 */
export function GuestbookDialog() {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof guestbookDialogFormSchema>>({
    resolver: zodResolver(guestbookDialogFormSchema),
    defaultValues: {
      color: "text",
      username: "",
      message: "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof guestbookDialogFormSchema>,
  ) => {
    await saveGuestbookEntryAction({
      message: values.message,
      username: values.username,
      color: values.color,
    });
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="default" className="w-fit">
          Customize
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Customize Your Guestbook Entry</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="lg:space-y-4 space-y-2"
        >
          <Controller
            control={form.control}
            name="color"
            render={({ field, fieldState }) => (
              <Field
                data-invalid={!!fieldState.error}
                className="flex flex-col gap-2"
              >
                <FieldLabel>Colour</FieldLabel>
                <Popover modal={true}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-50 justify-between",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value
                        ? field.value.charAt(0).toUpperCase() +
                          field.value.slice(1)
                        : "Select colour"}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-70" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-50 p-0 font-sans font-medium">
                    <Command>
                      <CommandInput
                        placeholder="Search colour..."
                        className="h-9"
                      />
                      <CommandList className="max-h-48 lg:max-h-72">
                        <CommandEmpty>No colour found.</CommandEmpty>
                        <CommandGroup className="py-1">
                          {guestbookColors.map((color) => (
                            <CommandItem
                              value={
                                color.charAt(0).toUpperCase() + color.slice(1)
                              }
                              key={color}
                              onSelect={() => {
                                form.setValue("color", color);
                              }}
                              className={`text-${color}`}
                            >
                              {color.charAt(0).toUpperCase() + color.slice(1)}
                              <CheckIcon
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  color === field.value
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FieldDescription>
                  This is the{" "}
                  <span className={`text-${field.value} font-bold`}>
                    colour
                  </span>{" "}
                  that your name will be rendered as.
                </FieldDescription>
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="username"
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error} className="gap-2">
                <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                <Input
                  id={field.name}
                  aria-label="Your displayed name"
                  placeholder="Enter a name to be displayed..."
                  aria-invalid={!!fieldState.error}
                  {...field}
                />
                <FieldDescription>
                  This is your public display name.
                </FieldDescription>
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="message"
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error} className="gap-2">
                <FieldLabel htmlFor={field.name}>Message</FieldLabel>
                <Textarea
                  id={field.name}
                  aria-label="Your message"
                  placeholder="Type your message here..."
                  className="h-24"
                  aria-invalid={!!fieldState.error}
                  {...field}
                />
                <FieldDescription>
                  This will be your guestbook entry.
                </FieldDescription>
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
