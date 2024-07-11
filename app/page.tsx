import { Suspense } from "react";

import { MostViewedPosts } from "@/components/mostViewedPosts";
import EmailSubButton from "@/components/emailSubButton";
import { siteConfig } from "@/config/site";
import ListPosts from "@/components/listPosts";

export default function Home() {
  return (
    <section className="max-w-prose mx-auto my-8 prose px-4 prose-h1:my-0">
      <h1>
        Latest Posts
      </h1>
      <hr/>
      <ListPosts startInd={0} endInd={siteConfig.postNumPerPage}/>
      <hr/>
      <EmailSubButton/>
      <hr/>
      <h1 className="mb-6">
        Top Posts
      </h1>
      <Suspense>
        <MostViewedPosts postNum={Math.floor(siteConfig.postNumPerPage * 1.5)}/>
      </Suspense>
    </section>
  )
}