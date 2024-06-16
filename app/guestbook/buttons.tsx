'use client';

import { signIn, signOut } from 'next-auth/react';
import GithubSvg from '@/app/ui/githubSvg';

export function SignOut() {
  return (
    <button
      className="text-sm text-[#4c4f69] dark:text-[#cdd6f4] mt-2 mb-6 underline"
      onClick={() => signOut()}
    >
      Sign out
    </button>
  );
}

export function SignIn() {
  return (
    <button
      className="w-full items-center justify-center border border-[#bcc0cc] dark:border-[#45475a] bg-[#e6e9ef] dark:bg-[#181825] rounded-md p-4 not-prose inline-flex text-[#4c4f69] dark:text-[#cdd6f4] mb-6"
      onClick={() => signIn('github')}
    >
      <GithubSvg width={20} height={20}/>
      <div className="ml-4">Sign in with GitHub</div>
    </button>
  );
}