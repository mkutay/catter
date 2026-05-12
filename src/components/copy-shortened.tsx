"use client";

import { ClipboardIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { siteConfig } from "@/config/site";

export function CopyShortened({ shortened }: { shortened: string }) {
  const { toast } = useToast();

  return (
    <Button
      onClick={() => {
        navigator.clipboard.writeText(`${siteConfig.url}/${shortened}`);
        toast({
          title: "Copied to clipboard!",
        });
      }}
      variant="outline"
      size="md"
    >
      <ClipboardIcon
        className="mr-2 h-5 w-5"
        strokeWidth="0.3px"
        stroke="currentColor"
      />
      Share
    </Button>
  );
}
