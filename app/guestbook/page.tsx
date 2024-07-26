import { Suspense } from 'react';

import { auth } from '@/lib/auth';
import { getGuestbookEntries } from '@/lib/dataBaseQueries';
import { SignIn, SignOut } from '@/app/guestbook/buttons';
import Form from '@/app/guestbook/form';
import DoublePane from '@/components/doublePane';

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
      <Suspense>
        <GuestbookForm/>
      </Suspense>
      <Suspense>
        <GuestbookEntries/>
      </Suspense>
    </DoublePane>
  );
}

async function GuestbookForm() {
  let session = await auth();

  return session?.user ? (
    <div className="flex flex-col gap-2">
      <Form/>
      <SignOut/>
    </div>
  ) : (
    <div className="items-center justify-center flex">
      <SignIn/>
    </div>
  );
}

async function GuestbookEntries() {
  let entries = await getGuestbookEntries();

  if (entries.length === 0) {
    return null;
  }

  return entries.map((entry: any) => (
    <div key={entry.id} className="flex flex-col my-2">
      <div className="w-full break-words">
        <span className="text-sapphire mr-1">
          {entry.created_by}:
        </span>
        <span className="text-text">
          {entry.body}
        </span>
      </div>
    </div>
  ));
}