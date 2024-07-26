import { Suspense } from 'react';
import Link from 'next/link';

import { auth } from '@/lib/auth';
import { getGuestbookEntries } from '@/lib/dataBaseQueries';
import Form from '@/app/guestbook/form';
import DoublePane from '@/components/doublePane';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { GuestBookSignIn, GuestBookSignOut } from '@/components/guestBookButtons';

export const metadata = {
  title: 'Sign and Mark My Guestbook',
  description: 'Sign my guestbook and leave your mark on this infinite internet, here.',
};

export default function Page() {
  return (
    <DoublePane>
      <h1 className="mb-0">
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
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" className="w-fit not-prose" asChild>
            <Link href="/guestbook/admin" className="text-text">
              Admin
            </Link>
          </Button>
        </div>
      </main>
    </DoublePane>
  );
}

async function GuestbookForm() {
  let session = await auth();

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
  let entries = await getGuestbookEntries();

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      {entries.map((entry: any) => (
        <div key={entry.id} className="w-full break-words">
          <span className="text-text mr-1 font-bold tracking-tight">
            {entry.created_by}:
          </span>
          <span className="text-text">
            {entry.body}
          </span>
        </div>
      ))}
    </div>
  );
}

function GuestbookEntriesFallback() {
  const entries: number[] = [];
  for (let i = 0; i < 8; i++) {
    entries.push(i);
  }
  return (
    <div>
      {entries.map((entry: number) => (
        <div key={entry} className="my-3">
          <Skeleton className="text-text h-6"/>
        </div>
      ))}
    </div>
  );
}

