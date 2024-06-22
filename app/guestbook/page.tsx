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
    <section className="prose max-w-prose mx-auto my-0 py-8 px-4 sm:px-8 prose-h1:my-0">
      <h1 className="mb-0">
        Sign my guestbook!
      </h1>
      <hr/>
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
      <Form/>
      <SignOut/>
    </>
  ) : (
    <SignIn/>
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
        <span className="text-[#d20f39] dark:text-[#f38ba8] mr-1">
          {entry.created_by}:
        </span>
        <span className="text-[#4c4f69] dark:text-[#cdd6f4]">
          {entry.body}
        </span>
      </div>
    </div>
  ));
}