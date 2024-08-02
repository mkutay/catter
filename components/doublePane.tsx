import { Suspense } from 'react';
import Link from 'next/link';
import { Mailbox } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { MostViewedPosts, MostViewedPostsFallback } from '@/components/mostViewedPosts';
import { siteConfig } from '@/config/site';

export default function DoublePane({
  children,
  }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="justify-center px-4 flex lg:flex-row flex-col lg:gap-16 gap-0 lg:max-w-6xl max-w-prose mx-auto">
      <div className="prose max-w-prose lg:mx-0 mx-auto">
        {children}
      </div>
      <div className="prose w-fit lg:mx-0 mx-auto sticky top-16 h-fit">
        <hr className="lg:hidden flex"/>
        <h1>
          Popular Content
        </h1>
        <Suspense fallback={<MostViewedPostsFallback postNum={siteConfig.postNumPerPage}/>}>
          <MostViewedPosts postNum={siteConfig.postNumPerPage}/>
        </Suspense>
        <EmailSubButton/>
      </div>
    </section>
  );
}

export function EmailSubButton() {
  return (
    <div className="grid grid-rows-1 gap-4 prose-p:my-0">
      <p className="text-lg col-auto">
        Subscribe to my newsletter to get updates on new posts and email only specials.
      </p>
      <div className="flex justify-center items-center not-prose">
        <Button variant="secondary" size="lg" asChild>
          <Link href={siteConfig.newsletterSubscribe} className="flex flex-row gap-3">
            <Mailbox stroke="currentColor" strokeWidth="1.8px"/>
            <div>Subscribe!</div>
          </Link>
        </Button>
      </div>
    </div>
  );
}