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
    <section className="my-8 lg:my-0 justify-center px-4 prose-h1:my-0 flex lg:flex-row flex-col lg:gap-16 gap-0 lg:max-w-6xl max-w-prose mx-auto prose">
      <div className="max-w-prose lg:mx-0 mx-auto lg:my-8">
        {children}
      </div>
      <div className="w-full lg:mx-0 mx-auto prose-h1:mb-6 lg:prose-h1:my-0 sticky top-16 h-fit lg:py-8">
        <hr className="lg:hidden flex"/>
        <h1>
          Popular Content
        </h1>
        <hr className="hidden lg:flex"/>
        <Suspense fallback={<MostViewedPostsFallback postNum={Math.floor(siteConfig.postNumPerPage * 1.25)}/>}>
          <MostViewedPosts postNum={Math.floor(siteConfig.postNumPerPage * 1.25)}/>
        </Suspense>
        {/* <MostViewedPostsFallback postNum={Math.floor(siteConfig.postNumPerPage * 1.25)}/> */}
        <hr/>
        <EmailSubButton/>
      </div>
    </section>
  );
}