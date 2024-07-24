import { Suspense } from 'react';

import { MostViewedPosts } from '@/components/mostViewedPosts';
import EmailSubButton from '@/components/emailSubButton';
import { siteConfig } from '@/config/site';

export default function DoublePane({
  children,
  }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="my-8 lg:my-0 justify-center px-4 lg:px-8 prose-h1:my-0 flex lg:flex-row flex-col lg:gap-24 gap-0 lg:max-w-6xl max-w-prose mx-auto">
      <div className="lg:w-2/3 prose w-full lg:mx-0 mx-auto lg:my-8">
        {children}
      </div>
      <div className="lg:w-1/3 prose w-full lg:mx-0 mx-auto prose-h1:mb-6 lg:prose-h1:my-0 sticky top-0 h-full lg:py-8">
        <hr className="lg:hidden flex"/>
        <h1>
          Popular Content
        </h1>
        <hr className="hidden lg:flex"/>
        <Suspense>
          <MostViewedPosts postNum={Math.floor(siteConfig.postNumPerPage * 1.5)}/>
        </Suspense>
        <hr/>
        <EmailSubButton/>
      </div>
    </section>
  );
}