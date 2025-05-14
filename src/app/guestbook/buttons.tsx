'use client';

import { signIn, signOut } from 'next-auth/react';
import { FaDiscord, FaGithub, FaSpotify } from 'react-icons/fa';

import { Button } from '@/components/ui/button';

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
    <div className="flex md:flex-row flex-col md:gap-2 gap-3 items-center mx-auto w-fit">
      <Button variant="secondary" size="default" className="flex flex-row gap-3 items-center" onClick={() => signIn('github')}>
        <FaGithub size="20px"/>
        Sign in with GitHub
      </Button>
      <Button variant="secondary" size="default" className="flex flex-row gap-3 items-center" onClick={() => signIn('discord')}>
        <FaDiscord size="20px"/>
        Sign in with Discord
      </Button>
      <Button variant="secondary" size="default" className="flex flex-row gap-3 items-center" onClick={() => signIn('spotify')}>
        <FaSpotify size="20px"/>
        Sign in with Spotify
      </Button>
    </div>
  );
}