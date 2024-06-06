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
    <section>
      <h1 className="font-medium text-2xl mb-8 tracking-tighter">admin</h1>
      <Form entries={entries} />
    </section>
  );
}