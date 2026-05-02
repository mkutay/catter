"use client";

import { signIn, signOut } from "next-auth/react";
import { FaDiscord, FaGithub, FaSpotify } from "react-icons/fa";
import { TypographySmall } from "@/components/typography/paragraph";
import { Button } from "@/components/ui/button";

export function GuestBookSignOut() {
  return (
    <Button
      variant="ghost"
      size="default"
      onClick={() => signOut()}
      className="w-fit"
    >
      Sign out
    </Button>
  );
}

export function GuestBookSignIn() {
  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex flex-row gap-2 items-center w-full">
        <Button
          variant="secondary"
          size="sm"
          className="flex flex-row gap-2 items-center flex-1 w-full"
          onClick={() => signIn("github")}
        >
          <FaGithub className="size-4" />
          GitHub
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="flex flex-row gap-2 items-center flex-1 w-full"
          onClick={() => signIn("discord")}
        >
          <FaDiscord className="size-4" />
          Discord
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="flex flex-row gap-2 items-center flex-1 w-full"
          onClick={() => signIn("spotify")}
        >
          <FaSpotify className="size-4" />
          Spotify
        </Button>
      </div>
      <TypographySmall className="font-sans">
        Sign in to leave your mark on this infinite internet, here.
      </TypographySmall>
    </div>
  );
}
