"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function CopyCodeButton({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      className={cn(
        "text-[#c6d0f5] hover:opacity-80 transition-all",
        className,
      )}
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
      aria-label="Copy to clipboard"
      type="button"
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
    </button>
  );
}
