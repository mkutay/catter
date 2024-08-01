import { Suspense } from 'react';

import { MostViewedPosts } from '@/components/mostViewedPosts';
import EmailSubButton from '@/components/emailSubButton';
import { MostViewedPostsFallback } from '@/components/mostViewedPosts';
import { siteConfig } from '@/config/site';

export default function DoublePane({
  children,
  }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="justify-center px-4 flex lg:flex-row flex-col lg:gap-16 gap-0 lg:max-w-6xl max-w-prose mx-auto">
      <div className="prose lg:mx-0 mx-auto max-w-prose">
        {children}
      </div>
      <div className="prose lg:mx-0 mx-auto sticky top-16 h-fit">
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