import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { unstable_cache } from 'next/cache';

import { GuestbookAdminForm } from '@/app/admin/guestbookAdminForm';
import { CommentsAdmin } from '@/app/admin/commentsAdmin';
import { auth } from '@/lib/auth';
import { getEveryComment, getGuestbookEntries } from '@/lib/dataBaseQueries';
import { siteConfig } from '@/config/site';
import DoublePane from '@/components/doublePane';

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

// Needs admin session
export default async function Page() {
  const session = await auth();
  
  if (!siteConfig.admins.includes(session?.user?.email || '')) {
    redirect('/');
  }
  
  const entries = await getCachedGuestbookEntries();
  const comments = await getEveryComment();

  return (
    <DoublePane>
      <h1 className="scroll-m-20 text-2xl font-semibold tracking-wide text-secondary uppercase my-6">Admin</h1>
      <h2 className="scroll-m-20 border-b border-border pb-1 text-3xl font-semibold tracking-tight mt-6 mb-2">Guestbook</h2>
      <GuestbookAdminForm entries={entries}/>
      <h2 className="scroll-m-20 border-b border-border pb-1 text-3xl font-semibold tracking-tight mt-6">Comments</h2>
      <CommentsAdmin comments={comments}/>
    </DoublePane>
  );
}