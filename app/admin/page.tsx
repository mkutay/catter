import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { unstable_cache } from 'next/cache';

import { auth } from '@/lib/auth';
import AddEmailForm from '@/app/admin/addEmailForm';
import DeleteAdminForm from '@/app/admin/deleteAdminForm';
import { getGuestbookEntries, isAdmin, getAdmins } from '@/lib/dataBaseQueries';
import GuestbookAdminForm from './guestbookAdminForm';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Site Admin',
  robots: {
    index: false,
    follow: false,
    nocache: false,
  },
};

const getCachedGuestbookEntries = unstable_cache(
  async () => getGuestbookEntries(),
  ['nextjs-blog-guestbook-entries'],
  {
    revalidate: 900, // 15 minutes
  }
);

export default async function Page() {
  const session = await auth();
  const admins = await getAdmins();

  if (!(await isAdmin(session?.user?.email || ''))) {
    redirect('/');
  }

  const entries = await getCachedGuestbookEntries();

  return (
    <section className="prose max-w-prose mx-auto px-4">
      <h1>Admin</h1>
      <h2>Site Admins</h2>
      <div className="flex flex-col gap-8">
        <AddEmailForm/>
        <DeleteAdminForm admins={admins}/>
      </div>
      <h2>Guestbook</h2>
      <GuestbookAdminForm entries={entries}/>
    </section>
  );
}