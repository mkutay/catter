import { auth } from '@/app/lib/auth';
import { getGuestbookEntries } from '@/app/lib/dataBaseQueries';
import { redirect } from 'next/navigation';
import Form from '@/app/admin/form';

export const metadata = {
  title: 'Admin',
};

export default async function Page() {
  let session = await auth();
  if (session?.user?.email !== 'hello@mkutay.dev') {
    redirect('/');
  }

  let entries = await getGuestbookEntries();

  return (
    <section className="prose max-w-prose mx-auto px-8 py-8">
      <h1>Admin</h1>
      <Form entries={entries} />
    </section>
  );
}