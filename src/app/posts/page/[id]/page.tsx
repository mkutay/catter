import type { Metadata } from "next";
import ListPosts from "@/components/listPosts";
import PaginationArrows from "@/components/paginationArrows";
import { TotalBlogViews } from "@/components/totalBlogViews";
import { siteConfig } from "@/config/site";
import { getPostsLength } from "@/lib/dbContentQueries";

export const dynamic = "force-static";
// export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const result = await getPostsLength({});
  if (result.isErr()) throw new Error(result.error.message);
  const postsLength = result.value;

  return {
    title: `Posts and Tags On the Blog | Page ${id}`,
    description: `List of all the latest posts and tags on ${siteConfig.name}, currently on page ${id} out of ${Math.ceil(postsLength / siteConfig.postNumPerPage)}.`,
    openGraph: {
      title: `Posts | Page ${id}`,
      description: `List of all the latest posts on ${siteConfig.name}, currently on page ${id} out of ${Math.ceil(postsLength / siteConfig.postNumPerPage)}.`,
      url: `${siteConfig.url}/posts/page/${id}`,
    },
  };
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = Number(params.id);
  const startInd = siteConfig.postNumPerPage * (id - 1);
  const endInd = siteConfig.postNumPerPage * id;

  const result = await getPostsLength({ disallowTags: ["project"] });
  if (result.isErr()) throw new Error(result.error.message);
  const postsLength = result.value;

  return (
    <>
      <h1 className="scroll-m-20 text-3xl font-semibold tracking-wide text-primary uppercase my-6">
        List of All Posts and Tags
      </h1>
      <ListPosts
        startInd={startInd}
        endInd={endInd}
        disallowTags={["project"]}
      />
      <div className="my-4">
        <PaginationArrows
          totalPages={Math.ceil(postsLength / siteConfig.postNumPerPage)}
          currentId={id}
          href="/posts/page"
        />
      </div>
      <TotalBlogViews />
    </>
  );
}

export async function generateStaticParams() {
  const result = await getPostsLength({ disallowTags: ["project"] });
  if (result.isErr()) throw new Error(result.error.message);
  const postsLength = result.value;

  const ret: { id: string }[] = [];

  for (
    let i = 1;
    i <= Math.ceil(postsLength / siteConfig.postNumPerPage);
    i++
  ) {
    ret.push({ id: i.toString() });
  }

  return ret;
}
