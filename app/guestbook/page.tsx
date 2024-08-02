import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import DoublePane from '@/components/doublePane';
import { auth } from '@/lib/auth';
import { getGuestbookEntries } from '@/lib/dataBaseQueries';
import { cn } from '@/lib/utils';
import { entryMeta, siteConfig } from '@/config/site';
import { GuestBookSignIn, GuestBookSignOut } from '@/app/guestbook/buttons';
import GuestbookZodForm from '@/app/guestbook/form';
import { GuestbookDialog } from '@/app/guestbook/dialog';

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
      <h1>
        Sign My Guestbook!
      </h1>
      <main className="flex flex-col gap-4">
        <Suspense fallback={<Skeleton className="h-12 md:w-2/5 w-full"/>}>
          <GuestbookForm/>
        </Suspense>
        <Suspense fallback={<GuestbookEntriesFallback/>}>
          <GuestbookEntries/>
        </Suspense>
        <div className="flex flex-row justify-end gap-2 items-center not-prose">
          <GuestbookDialog/>
        </div>
      </main>
    </DoublePane>
  );
}

async function GuestbookForm() {
  const session = await auth();

  return session?.user ? (
    <div className="flex flex-col gap-2">
      <GuestbookZodForm/>
      <GuestBookSignOut/>
    </div>
  ) : (
    <div className="items-center justify-center flex">
      <GuestBookSignIn/>
    </div>
  );
}

// text-rosewater text-flamingo text-pink text-mauve text-red text-maroon text-peach text-yellow text-green text-teal text-sky text-sapphire text-blue text-lavender
// List all entries in the guestbook with respect to their color and names
async function GuestbookEntries() {
  const entries = await getGuestbookEntries();

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      {entries.map((entry: entryMeta) => (
        <div key={entry.id} className="w-full break-words">
          <span className={cn(
            "mr-1 font-bold tracking-tight",
            (entry.color === '' || entry.color === null) ? 'text-foreground' : `text-${entry.color}`
          )}>
            {entry.created_by}:
          </span>
          <span className="text-foreground">
            {entry.body}
          </span>
        </div>
      ))}
    </div>
  );
}

function GuestbookEntriesFallback() {
  const entries: React.ReactNode[] = [];

  for (let i = 0; i < 8; i++) {
    entries.push(
      <Skeleton className="h-6 lg:w-[65ch] w-full" key={i}/>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {entries}
    </div>
  );
}

