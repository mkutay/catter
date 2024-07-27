import { redirect } from 'next/navigation';
import Link from 'next/link';

import { auth } from '@/lib/auth';
import { getGuestbookEntries } from '@/lib/dataBaseQueries';
import Form from '@/app/guestbook/admin/form';
import DoublePane from '@/components/doublePane';
import { Button } from '@/components/ui/button';

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
    <DoublePane>
      <h1>Admin</h1>
      <hr/>
      <Form entries={entries}/>
      <div className="justify-end flex not-prose mt-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/guestbook" className="text-text">
            Return to Guest Book
          </Link>
        </Button>
      </div>
    </DoublePane>
  );
}