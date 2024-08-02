import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { unstable_cache } from 'next/cache';

import { GuestbookAdminForm } from '@/app/admin/guestbookAdminForm';
import { CommentsAdmin } from '@/app/admin/commentsAdmin';
import { auth } from '@/lib/auth';
import { getEveryComment, getGuestbookEntries } from '@/lib/dataBaseQueries';
import { siteConfig } from '@/config/site';

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
    <section className="prose max-w-prose mx-auto px-4">
      <h1>Admin</h1>
      <h2>Guestbook</h2>
      <GuestbookAdminForm entries={entries}/>
      <div className="prose-h2:mb-0">
        <h2>Comments</h2>
      </div>
      <CommentsAdmin comments={comments}/>
    </section>
  );
}