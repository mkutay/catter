"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import type z from "zod";

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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { updateKeyValueFormSchema } from "@/config/schema";
import type { existingKeys } from "@/config/site";
import { updateKeyValueAction } from "@/lib/server-helper";
import { cn } from "@/lib/utils";

export function HomePagePostsForm({
  slotKey,
  value,
  allSlugs,
}: {
  slotKey: (typeof existingKeys)[number];
  value: string | undefined;
  allSlugs: string[];
}) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof updateKeyValueFormSchema>>({
    resolver: zodResolver(updateKeyValueFormSchema),
    defaultValues: {
      value,
    },
  });

  const onSubmit = async (values: z.infer<typeof updateKeyValueFormSchema>) => {
    const updated = await updateKeyValueAction({
      key: slotKey,
      value: values.value,
    });

    if (!updated.ok) {
      toast({
        title: "Error updating homepage slot.",
        description: updated.error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Homepage slot updated.",
      description: `Now showing: ${values.value}`,
      variant: "default",
    });

    form.reset({ value: values.value });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-row gap-2"
      >
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <Popover modal={true}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground",
                      )}
                      size="sm"
                    >
                      {field.value || "Select post slug"}
                      <CaretSortIcon className="h-4 w-4 shrink-0 opacity-70" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0 font-sans font-medium">
                  <Command>
                    <CommandInput
                      placeholder="Search slug..."
                      className="h-9"
                    />
                    <CommandList className="max-h-48 lg:max-h-72">
                      <CommandEmpty>No slug found.</CommandEmpty>
                      <CommandGroup className="py-1">
                        {allSlugs.map((slug) => (
                          <CommandItem
                            value={slug}
                            key={slug}
                            onSelect={() => {
                              form.setValue("value", slug, {
                                shouldValidate: true,
                                shouldDirty: true,
                              });
                            }}
                          >
                            {slug}
                            <CheckIcon
                              className={cn(
                                "ml-auto h-4 w-4",
                                slug === field.value
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
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="sm" className="w-fit">
          Save
        </Button>
      </form>
    </Form>
  );
}
