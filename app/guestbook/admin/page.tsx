import { redirect } from 'next/navigation';
import Link from 'next/link';
import { unstable_cache } from 'next/cache';

import Form from '@/app/guestbook/admin/form';
import DoublePane from '@/components/doublePane';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/auth';
import { getGuestbookEntries } from '@/lib/dataBaseQueries';
import { siteConfig } from '@/config/site';

export const metadata = {
  title: 'Admin',
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

  if (!siteConfig.guestbook.siteAdmins.includes(session?.user?.email || '')) {
    redirect('/guestbook');
  }

  const entries = await getCachedGuestbookEntries();

  return (
    <DoublePane>
      <h1>Admin</h1>
      <Form entries={entries}/>
      <div className="justify-end flex not-prose mt-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/guestbook">
            Return to Guest Book
          </Link>
        </Button>
      </div>
    </DoublePane>
  );
}