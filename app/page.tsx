import { Suspense } from 'react';

import { MostViewedPosts } from '@/components/mostViewedPosts';
import EmailSubButton from '@/components/emailSubButton';
import { siteConfig } from '@/config/site';
import ListPosts from '@/components/listPosts';

export default function Home() {
  return (
    <section className="justify-center my-8 px-4 prose-h1:my-0 flex lg:flex-row flex-col lg:gap-8 gap-0">
      <div className="lg:w-2/3 prose w-full lg:mx-0 mx-auto">
        <h1>
          Latest Posts
        </h1>
        <hr/>
        <ListPosts startInd={0} endInd={siteConfig.postNumPerPage}/>
      </div>
      <div className="lg:w-1/3 prose w-full lg:mx-0 mx-auto">
        <hr className="lg:hidden flex"/>
        <h1 className="mb-6">
          Top Posts
        </h1>
        <Suspense>
          <MostViewedPosts postNum={Math.floor(siteConfig.postNumPerPage * 1.5)}/>
        </Suspense>
        <hr/>
        <EmailSubButton/>
      </div>
    </section>
  )
}