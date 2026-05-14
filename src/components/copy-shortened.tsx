"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { siteConfig } from "@/config/site";

export function CopyShortened({ shortened }: { shortened: string }) {
  const { toast } = useToast();

  return (
    <Button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(`${siteConfig.url}/${shortened}`);
          toast({
            title: "Copied to clipboard!",
          });
        } catch {
          // Clipboard writes can fail if permissions are denied or the context is insecure.
        }
      }}
      variant="default"
      size="sm"
    >
      Share
    </Button>
  );
}
