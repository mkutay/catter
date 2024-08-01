import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { unstable_cache } from 'next/cache';

import { auth } from '@/lib/auth';
import { getGuestbookEntries, isAdmin, getAdmins } from '@/lib/dataBaseQueries';
import AddEmailForm from '@/app/admin/addEmailForm';
import DeleteAdminForm from '@/app/admin/deleteAdminForm';
import GuestbookAdminForm from '@/app/admin/guestbookAdminForm';

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

// Needs admin session or loads when there is no admin on the site
export default async function Page() {
  const session = await auth();
  
  if (!(await isAdmin(session?.user?.email || ''))) {
    redirect('/');
  }
  
  const admins = await getAdmins();
  const entries = await getCachedGuestbookEntries();

  return (
    <section className="prose max-w-prose mx-auto px-4">
      <h1>Admin</h1>
      <h2>Site Admins</h2>
      <div className="flex flex-col gap-6">
        <AddEmailForm/>
        <DeleteAdminForm admins={admins}/>
      </div>
      <h2>Guestbook</h2>
      <GuestbookAdminForm entries={entries}/>
    </section>
  );
}