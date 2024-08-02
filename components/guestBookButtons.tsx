'use client';

import { signIn, signOut } from 'next-auth/react';
import { FaDiscord, FaGithub, FaSpotify } from 'react-icons/fa';
import { TbReload } from 'react-icons/tb';

import { Button } from '@/components/ui/button';
import { revalidateGuestbook } from '@/lib/dataBaseActions';

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

export function RevalidateGuestbook() {
  return (
    <Button type="button" aria-label="Revalidate Guestbook" variant="ghost" size="icon" onClick={() => revalidateGuestbook()}>
      <TbReload size="16px" strokeWidth="3px"/>
    </Button>
  );
}