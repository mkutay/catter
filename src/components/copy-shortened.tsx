"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export function CopyShortened({ shortened }: { shortened: string }) {
  return (
    <Button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(`${siteConfig.url}/${shortened}`);
          toast("Copied to clipboard!");
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
