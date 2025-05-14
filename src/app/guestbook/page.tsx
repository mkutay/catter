import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { auth } from '@/lib/auth';
import { getGuestbookEntries } from '@/lib/database-queries/guestbook';
import { cn } from '@/lib/utils';
import { EntryData } from '@/config/types';
import { siteConfig } from '@/config/site';
import DoublePane from '@/components/doublePane';
import GuestbookForm from './form';
import { GuestBookSignIn } from './buttons';

export const metadata = {
  title: 'Sign and Mark My Guestbook',
  description: 'Sign my guestbook and leave your mark on this infinite internet, here.',
  keywords: ['guestbook', 'mark'],
  openGraph: {
    title: 'Sign and Mark My Guestbook',
    description: 'Sign my guestbook and leave your mark on this infinite internet, here.',
    url: siteConfig.url + '/guestbook',
    locale: 'en_UK',
    type: 'website',
    images: ['images/favicon.png'],
    siteName: siteConfig.name,
  },
};

export default function Page() {
  return (
    <DoublePane>
      <h1 className="scroll-m-20 text-3xl font-semibold tracking-wide text-primary uppercase my-6">
        Sign My Guestbook!
      </h1>
      <main className="flex flex-col gap-4">
        <Suspense fallback={<Skeleton className="h-10 w-full" />}>
          <Form />
        </Suspense>
        <Suspense fallback={<GuestbookEntriesFallback />}>
          <GuestbookEntries />
        </Suspense>
      </main>
    </DoublePane>
  );
}

async function Form() {
  const session = await auth();

  return session?.user ? (
    <div className="flex flex-col gap-2">
      <GuestbookForm />
    </div>
  ) : (
    <div className="items-center justify-center flex">
      <GuestBookSignIn />
    </div>
  );
}

// text-rosewater text-flamingo text-pink text-mauve text-red text-maroon text-peach text-yellow text-green text-teal text-sky text-sapphire text-blue text-lavender
async function GuestbookEntries() {
  const entriesResult = await getGuestbookEntries();

  if (entriesResult.isErr()) {
    console.error("Error in displaying guestbook entries in /guestbook:", entriesResult.error.message);
    return (
      <div>
        <p className="font-normal leading-7 [&:not(:first-child)]:mt-6 text-destructive">
          There was an error loading the guestbook entries. Please try again later.
        </p>
      </div>
    );
  }
  
  const entries = entriesResult.value;

  return (
    <div>
      {entries.map((entry: EntryData) => (
        <p key={entry.id} className="w-full break-words lg:text-lg text-md leading-7 [&:not(:first-child)]:mt-2">
          <span className={cn(
            "mr-1 font-bold tracking-tight",
            (entry.color === '' || entry.color === null) ? 'text-foreground' : `text-${entry.color}`
          )}>
            {entry.created_by}:
          </span>
          <span className="text-foreground">
            {entry.body}
          </span>
        </p>
      ))}
    </div>
  );
}

function GuestbookEntriesFallback() {
  const entries: React.ReactNode[] = [];

  for (let i = 0; i < 8; i++) {
    entries.push(
      <Skeleton key={i} className="h-6 w-full leading-7 [&:not(:first-child)]:mt-4"/>
    );
  }

  return (
    <div>
      {entries}
    </div>
  );
}

