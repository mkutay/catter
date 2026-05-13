"use client";

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
      variant="default"
      size="sm"
    >
      Share
    </Button>
  );
}
