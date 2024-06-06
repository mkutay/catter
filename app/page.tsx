import ListOfPosts from "@/app/ui/listOfPosts";

export default function Home() {
  return (
    <section className="max-w-prose mx-auto my-0 py-8 prose px-4 sm:px-8">
      <h1>
        Latest Posts
      </h1>
      <ListOfPosts lastNumOfPosts={5}/>
    </section>
  )
}