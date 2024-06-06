import { auth } from '@/app/lib/auth';
import { getGuestbookEntries } from '@/app/lib/dataBaseQueries';
import { SignIn, SignOut } from '@/app/guestbook/buttons';
import { Suspense } from 'react';
import Form from '@/app/guestbook/form';

export const metadata = {
  title: 'Guestbook',
  description: 'Sign my guestbook and leave your mark.',
};

export default function Page() {
  return (
    <section className="prose max-w-prose mx-auto my-0 py-8 px-4 sm:px-8">
      <h1 className="tracking-tighter">
        Sign my guestbook!
      </h1>
      <Suspense>
        <GuestbookForm/>
        <GuestbookEntries/>
      </Suspense>
    </section>
  );
}

async function GuestbookForm() {
  let session = await auth();

  return session?.user ? (
    <>
      <Form />
      <SignOut />
    </>
  ) : (
    <SignIn />
  );
}

async function GuestbookEntries() {
  let entries = await getGuestbookEntries();

  if (entries.length === 0) {
    return null;
  }

  return entries.map((entry: any) => (
    <div key={entry.id} className="flex flex-col space-y-1 mb-4">
      <div className="w-full text-sm break-words">
        <span className="text-neutral-600 dark:text-neutral-400 mr-1">
          {entry.created_by}:
        </span>
        {entry.body}
      </div>
    </div>
  ));
}