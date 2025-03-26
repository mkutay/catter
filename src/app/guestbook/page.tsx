import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import DoublePane from '@/components/doublePane';
import { GuestBookSignIn } from '@/app/guestbook/buttons';
import GuestbookForm from '@/app/guestbook/form';
import { auth } from '@/lib/auth';
import { getGuestbookEntries } from '@/lib/dataBaseQueries';
import { cn } from '@/lib/utils';
import { entryType } from '@/config/schema';
import { siteConfig } from '@/config/site';

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
      <h1 className="hidden">
        {`${siteConfig.name} Guestbook`}
      </h1>
      <h2 className="scroll-m-20 text-2xl font-semibold tracking-wide text-primary uppercase my-6">
        Sign My Guestbook!
      </h2>
      <main className="flex flex-col gap-4">
        <Suspense fallback={<Skeleton className="h-12 md:w-2/5 w-full"/>}>
          <Form/>
        </Suspense>
        <Suspense fallback={<GuestbookEntriesFallback/>}>
          <GuestbookEntries/>
        </Suspense>
      </main>
    </DoublePane>
  );
}

async function Form() {
  const session = await auth();

  return session?.user ? (
    <div className="flex flex-col gap-2">
      <GuestbookForm/>
    </div>
  ) : (
    <div className="items-center justify-center flex">
      <GuestBookSignIn/>
    </div>
  );
}

// text-rosewater text-flamingo text-pink text-mauve text-red text-maroon text-peach text-yellow text-green text-teal text-sky text-sapphire text-blue text-lavender
async function GuestbookEntries() {
  const entries = await getGuestbookEntries();

  if (entries.length === 0) {
    return null;
  }

  return (
    <div>
      {entries.map((entry: entryType) => (
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

