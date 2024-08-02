'use client';

import { signIn, signOut } from 'next-auth/react';
import { FaDiscord, FaGithub, FaSpotify } from 'react-icons/fa';

import { Button } from '@/components/ui/button';

export function GuestBookSignOut() {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => signOut()}
      className="w-fit"
    >
      Sign out
    </Button>
  );
}

export function GuestBookSignIn() {
  return (
    <div className="flex md:flex-row flex-col gap-4 items-center mx-auto w-fit">
      <Button variant="secondary" size="default" className="flex flex-row gap-3 items-center" onClick={() => signIn('github')}>
        <FaGithub/>
        <span>
          Sign in with GitHub
        </span>
      </Button>
      <Button variant="secondary" size="default" className="flex flex-row gap-3 items-center" onClick={() => signIn('discord')}>
        <FaDiscord/>
        <span>
          Sign in with Discord
        </span>
      </Button>
      <Button variant="secondary" size="default" className="flex flex-row gap-3 items-center" onClick={() => signIn('spotify')}>
        <FaSpotify/>
        <span>
          Sign in with Spotify
        </span>
      </Button>
    </div>
  );
}