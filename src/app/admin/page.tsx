import { redirect } from 'next/navigation';
import { Metadata } from 'next';

import { GuestbookAdminForm } from '@/app/admin/guestbookAdminForm';
import { CommentsAdmin } from '@/app/admin/commentsAdmin';
import { auth } from '@/lib/auth';
import { getEveryComment } from '@/lib/database-queries/comments';
import { getGuestbookEntries } from '@/lib/database-queries/guestbook';
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

/**
 * Needs admin access to view this page.
 */
export default async function Page() {
  const session = await auth();
  
  if (!siteConfig.admins.includes(session?.user?.email || '')) {
    redirect('/');
  }
  
  const entries = await getGuestbookEntries();
  const comments = await getEveryComment();

  if (comments.isErr()) {
    console.error("Error in displaying all comements:", comments.error.message);
  }

  if (entries.isErr()) {
    console.error("Error in displaying guestbook entries:", entries.error.message);
  }

  return (
    <DoublePane>
      <h1 className="scroll-m-20 text-2xl font-semibold tracking-wide text-primary uppercase my-6">Admin</h1>
      <h2 className="scroll-m-20 border-b border-border pb-1 text-3xl font-semibold tracking-tight mt-6 mb-2">Guestbook</h2>
      {(entries.isErr() ? <p className="font-normal leading-7 [&:not(:first-child)]:mt-6 text-destructive">
          Could not display guestbook entries. Please try again later.
        </p> : <GuestbookAdminForm entries={entries.value} />
      )}
      <h2 className="scroll-m-20 border-b border-border pb-1 text-3xl font-semibold tracking-tight mt-6">Comments</h2>
      {(comments.isErr() ? <p className="font-normal leading-7 [&:not(:first-child)]:mt-6 text-destructive">
          Could not display comments. Please try again later.
        </p> : <CommentsAdmin comments={comments.value} />
      )}
    </DoublePane>
  );
}