'use client';

import { signIn, signOut } from 'next-auth/react';

import { GithubSvg } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { GitHubLogoIcon } from '@radix-ui/react-icons';

export function SignOut() {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => signOut()}
      className="mb-4 w-1/4"
    >
      Sign out
    </Button>
  );
}

export function SignIn() {
  return (
    <Button
      onClick={() => signIn('github')}
      variant="outline"
      size="lg"
      className="md:w-2/5 w-full mb-4"
    >
      <GitHubLogoIcon width={24} height={24}/>
      <div className="ml-4">Sign in with GitHub</div>
    </Button>
  );
}