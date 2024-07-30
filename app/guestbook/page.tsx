import { Suspense } from 'react';
import Link from 'next/link';

import DoublePane from '@/components/doublePane';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { GuestBookSignIn, GuestBookSignOut } from '@/components/guestBookButtons';
import { auth } from '@/lib/auth';
import { getGuestbookEntries } from '@/lib/dataBaseQueries';
import Form, { GuestBookPopOverForm } from '@/app/guestbook/form';
import { cn } from '@/lib/utils';
import { entryMeta, siteConfig } from '@/config/site';

export const metadata = {
  title: 'Sign and Mark My Guestbook',
  description: 'Sign my guestbook and leave your mark on this infinite internet, here.',
};

export default function Page() {
  return (
    <DoublePane>
      <h1>
        Sign My Guestbook!
      </h1>
      <hr/>
      <main className="flex flex-col gap-4">
        <Suspense fallback={<Skeleton className="h-12 md:w-2/5 w-full"/>}>
          <GuestbookForm/>
        </Suspense>
        <Suspense fallback={<GuestbookEntriesFallback/>}>
          <GuestbookEntries/>
        </Suspense>
        <div className="flex flex-row justify-end gap-2 not-prose">
          <Button variant="ghost" size="sm" className="w-fit" asChild>
            <Link href="/guestbook/admin" className="text-foreground">
              Admin
            </Link>
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="w-fit">
                Use a Code
              </Button>
            </PopoverTrigger>
            <PopoverContent className="max-w-3xl">
              <div className="grid gap-4">
                <p className="text-md text-foreground space-y-2">
                  Enter a code and a name to sign my guest book.
                </p>
                <GuestBookPopOverForm/>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </main>
    </DoublePane>
  );
}

async function GuestbookForm() {
  const session = await auth();

  return session?.user ? (
    <div className="flex flex-col gap-2">
      <Form/>
      <GuestBookSignOut/>
    </div>
  ) : (
    <div className="items-center justify-center flex">
      <GuestBookSignIn/>
    </div>
  );
}

async function GuestbookEntries() {
  const entries = await getGuestbookEntries();

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      {entries.map((entry: entryMeta) => (
        <div key={entry.id} className="w-full break-words">
          <span className={cn("mr-1 font-bold tracking-tight", entry.email.includes('@') ? "text-foreground" : siteConfig.guestbook.codesStyles[entry.email as keyof typeof siteConfig.guestbook.codesStyles])}>
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
      <Skeleton className="h-6" key={i}/>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {entries}
    </div>
  );
}

