import { Suspense } from 'react';
import Link from 'next/link';
import { unstable_cache } from 'next/cache';

import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import DoublePane from '@/components/doublePane';
import { GuestBookSignIn, GuestBookSignOut, RevalidateGuestbook } from '@/components/guestBookButtons';
import { auth } from '@/lib/auth';
import { getGuestbookEntries } from '@/lib/dataBaseQueries';
import { cn } from '@/lib/utils';
import { entryMeta, siteConfig } from '@/config/site';
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
        {/* <GuestbookEntriesFallback/> */}
        <div className="flex flex-row justify-between items-center not-prose">
          <RevalidateGuestbook/>
          <div className="flex flex-row gap-2 items-center">
            <Button variant="ghost" size="sm" className="w-fit" asChild>
              <Link href="/guestbook/admin" className="text-foreground">
                Admin
              </Link>
            </Button>
            <GuestbookDialog/>
          </div>
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

const getCachedGuestbookEntries = unstable_cache(
  async () => getGuestbookEntries(),
  ['nextjs-blog-guestbook-entries'],
  {
    revalidate: 900, // 15 minutes
  }
);

// text-rosewater text-flamingo text-pink text-mauve text-red text-maroon text-peach text-yellow text-green text-teal text-sky text-sapphire text-blue text-lavender
async function GuestbookEntries() {
  const entries = await getCachedGuestbookEntries();

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
      <Skeleton className="h-6 w-[65ch]" key={i}/>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {entries}
    </div>
  );
}

