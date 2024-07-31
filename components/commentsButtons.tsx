'use client';

import { FaDiscord, FaGithub, FaSpotify } from 'react-icons/fa';
import { signIn, signOut } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import { deleteComment } from '@/lib/dataBaseActions';
import { commentMeta, siteConfig } from '@/config/site';

export function SignOut() {
  return (
    <Button type="reset" variant="ghost" size="default" onClick={() => signOut()}>
      Sign Out
    </Button>
  );
}

export function SignIn({ slug }: { slug: string }) {
  return (
    <div className="flex flex-row gap-2 items-center mx-auto w-fit">
      <Button variant="secondary" size="default" className="flex flex-row gap-2 items-center" onClick={() => signIn('github', { callbackUrl: `/posts/${slug}#comments` })}>
        <FaGithub/>
        <span>
          GitHub
        </span>
      </Button>
      <Button variant="secondary" size="default" className="flex flex-row gap-2 items-center" onClick={() => signIn('discord', { callbackUrl: `/posts/${slug}#comments` })}>
        <FaDiscord/>
        <span>
          Discord
        </span>
      </Button>
      <Button variant="secondary" size="default" className="flex flex-row gap-2 items-center" onClick={() => signIn('spotify', { callbackUrl: `/posts/${slug}#comments` })}>
        <FaSpotify/>
        <span>
          Spotify
        </span>
      </Button>
    </div>
  );
}

export function DeleteComment({ comment }: { comment: commentMeta }) {
  return (
    <Button variant="destructive" size="sm" onClick={() => deleteComment({ comment })}>
      Delete Comment
    </Button>
  );
}