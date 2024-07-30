import { redirect } from 'next/navigation';
import Link from 'next/link';

import Form from '@/app/guestbook/admin/form';
import DoublePane from '@/components/doublePane';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/auth';
import { getGuestbookEntries } from '@/lib/dataBaseQueries';

export const metadata = {
  title: 'Admin',
};

export default async function Page() {
  const session = await auth();

  if (session?.user?.email !== 'hello@mkutay.dev') {
    redirect('/guestbook');
  }

  const entries = await getGuestbookEntries();

  return (
    <DoublePane>
      <h1>Admin</h1>
      <hr/>
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