'use client';

import { signIn, signOut } from 'next-auth/react';

export function SignOut() {
  return (
    <button
      className="text-xs text-neutral-700 dark:text-neutral-300 mt-2 mb-6"
      onClick={() => signOut()}
    >
      Sign out
    </button>
  );
}

export function SignIn() {
  return (
    <button
      className="border border-[#bcc0cc] dark:border-[#45475a] bg-[#ccd0da] dark:bg-[#313244] rounded p-4 not-prose text-sm inline-flex items-center leading-4 text-[#4c4f69] dark:text-[#cdd6f4] mb-8"
      onClick={() => signIn('github')}
    >
      <img alt="GitHub logo" src="/github-logo.svg" width="20" height="20" />
      <div className="ml-3">Sign in with GitHub</div>
    </button>
  );
}