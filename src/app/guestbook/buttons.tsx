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
      <div className="flex md:flex-row flex-col md:gap-2 gap-3 items-center mx-auto w-full">
        <Button
          variant="secondary"
          size="default"
          className="flex flex-row gap-2 items-center flex-1"
          onClick={() => signIn("github")}
        >
          <FaGithub size="20px" />
          GitHub
        </Button>
        <Button
          variant="secondary"
          size="default"
          className="flex flex-row gap-2 items-center flex-1"
          onClick={() => signIn("discord")}
        >
          <FaDiscord size="20px" />
          Discord
        </Button>
        <Button
          variant="secondary"
          size="default"
          className="flex flex-row gap-2 items-center flex-1"
          onClick={() => signIn("spotify")}
        >
          <FaSpotify size="20px" />
          Spotify
        </Button>
      </div>
      <TypographySmall className="font-sans">
        Sign in to leave your mark on this infinite internet, here.
      </TypographySmall>
    </div>
  );
}
