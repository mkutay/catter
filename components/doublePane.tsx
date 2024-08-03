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
      <div className="w-full lg:mx-0 mx-auto">
        {children}
      </div>
      <div className="w-fit lg:mx-0 mx-auto sticky top-16 h-fit">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-wide text-secondary uppercase lg:my-6 mt-12 mb-6">
          Popular Content
        </h2>
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
    <div className="flex flex-col gap-4 my-6">
      <p className="text-lg col-auto leading-7 [&:not(:first-child)]:mt-6">
        Subscribe to my newsletter to get updates on new posts and email only specials.
      </p>
      <Button variant="secondary" size="lg" className="flex mx-auto" asChild>
        <Link href={siteConfig.newsletterSubscribe} className="flex flex-row gap-3 w-fit">
          <Mailbox stroke="currentColor" strokeWidth="1.8px"/>
          <div>Subscribe!</div>
        </Link>
      </Button>
    </div>
  );
}