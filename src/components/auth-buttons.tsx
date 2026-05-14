"use client";

import { signIn, signOut } from "next-auth/react";
import { FaDiscord, FaGithub, FaSpotify } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SignOut({
  callbackUrl,
  className,
}: {
  callbackUrl?: string;
  className?: string;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="default"
      onClick={() => signOut({ callbackUrl })}
      className={className}
    >
      Sign Out
    </Button>
  );
}

export function SignIn({
  callbackUrl,
  className,
}: {
  callbackUrl?: string;
  className?: string;
}) {
  return (
    <div className="flex flex-row gap-2 items-center w-full">
      <Button
        variant="secondary"
        size="sm"
        className={cn("flex flex-row gap-2 items-center flex-1", className)}
        onClick={() => signIn("github", { callbackUrl })}
      >
        <FaGithub className="size-4" />
        GitHub
      </Button>
      <Button
        variant="secondary"
        size="sm"
        className={cn("flex flex-row gap-2 items-center flex-1", className)}
        onClick={() => signIn("discord", { callbackUrl })}
      >
        <FaDiscord className="size-4" />
        Discord
      </Button>
      <Button
        variant="secondary"
        size="sm"
        className={cn("flex flex-row gap-2 items-center flex-1", className)}
        onClick={() => signIn("spotify", { callbackUrl })}
      >
        <FaSpotify className="size-4" />
        Spotify
      </Button>
    </div>
  );
}
