"use client";

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { type FormEvent, useEffect, useState } from "react";

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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import type { existingKeys } from "@/config/site";
import { updateKeyValueHomePageAction } from "@/lib/server-helper";
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
  const [selectedSlug, setSelectedSlug] = useState(value);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSelectedSlug(value);
  }, [value]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedSlug) {
      toast({
        title: "Select a post slug.",
        description: "Pick a slug before saving the homepage slot.",
        variant: "destructive",
      });

      return;
    }

    setIsSaving(true);
    const updated = await updateKeyValueHomePageAction({
      key: slotKey,
      slug: selectedSlug,
    });
    setIsSaving(false);

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
      description: `Now showing: ${selectedSlug}`,
      variant: "default",
    });
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-row gap-2">
      <div className="flex flex-col w-full">
        <Popover modal={true}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                "w-full justify-between",
                !selectedSlug && "text-muted-foreground",
              )}
              size="sm"
            >
              {selectedSlug || "Select post slug"}
              <CaretSortIcon className="h-4 w-4 shrink-0 opacity-70" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0 font-sans font-medium">
            <Command>
              <CommandInput placeholder="Search slug..." className="h-9" />
              <CommandList className="max-h-48 lg:max-h-72">
                <CommandEmpty>No slug found.</CommandEmpty>
                <CommandGroup className="py-1">
                  {allSlugs.map((slug) => (
                    <CommandItem
                      value={slug}
                      key={slug}
                      onSelect={() => {
                        setSelectedSlug(slug);
                      }}
                    >
                      {slug}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          slug === selectedSlug ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <Button
        type="submit"
        size="sm"
        className="w-fit"
        disabled={!selectedSlug || isSaving}
      >
        {isSaving ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
