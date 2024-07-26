import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
import { getGuestbookEntries } from '@/lib/dataBaseQueries';
import Form from '@/app/guestbook/admin/form';

export const metadata = {
  title: 'Admin',
};

export default async function Page() {
  let session = await auth();
  if (session?.user?.email !== 'hello@mkutay.dev') {
    redirect('/guestbook');
  }

  let entries = await getGuestbookEntries();

  return (
    <section className="prose max-w-prose mx-auto px-4 lg:px-8 my-8">
      <h1>Admin</h1>
      <hr/>
      <Form entries={entries}/>
    </section>
  );
}