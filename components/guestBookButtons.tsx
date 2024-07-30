'use client';

import { signIn, signOut } from 'next-auth/react';
import { GitHubLogoIcon } from '@radix-ui/react-icons';

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
    <Button
      onClick={() => signIn('github')}
      variant="secondary"
      size="lg"
      className="w-fit"
    >
      <GitHubLogoIcon width={28} height={28}/>
      <div className="ml-4">Sign in with GitHub</div>
    </Button>
  );
}