import ListOfPosts from "@/app/ui/listOfPosts";
import { Suspense } from "react";
import { MostViewedPosts } from "@/app/ui/mostViewedPosts";

export default function Home() {
  return (
    <section className="max-w-prose mx-auto my-0 py-8 prose px-4 sm:px-8">
      <h1>
        Latest Posts
      </h1>
      <hr/>
      <ListOfPosts lastNumOfPosts={5}/>
      <hr/>
      <h1 className="mb-6">
        Top Posts
      </h1>
      <Suspense>
        <MostViewedPosts postNum={5}/>
      </Suspense>
    </section>
  )
}