import ListPosts from "@/components/listPosts";
import PaginationArrows from "@/components/paginationArrows";
import { turnTagString } from "@/components/tagsButtonGrid";
import { TotalBlogViews } from "@/components/totalBlogViews";
import { siteConfig } from "@/config/site";
import {
  getListOfAllTags,
  getPosts,
  getPostsLength,
} from "@/lib/dbContentQueries";

export const dynamic = "force-static";
// export const dynamicParams = false;

export async function generateMetadata(props: {
  params: Promise<{ tag: string; id: string }>;
}) {
  const params = await props.params;
  const { id, tag } = params;
  const result = await getPosts({ tags: [tag] });
  if (result.isErr()) throw new Error(result.error.message);
  const posts = result.value;

  return {
    title: `Posts With Tag: ${tag} | Page ${id}`,
    description: `List of all the tags that posts have on ${siteConfig.name}, currently displaying tag ${tag} on page ${id} out of ${Math.ceil(posts.length / siteConfig.postNumPerPage)}.`,
    openGraph: {
      title: `Posts With Tag: ${tag} | Page ${id}`,
      description: `List of all the tags that posts have on ${siteConfig.name}, currently displaying tag ${tag} on page ${id} out of ${Math.ceil(posts.length / siteConfig.postNumPerPage)}.`,
      url: `${siteConfig.url}/tags/${tag}/page/${id}`,
    },
  };
}

export default async function Page(props: {
  params: Promise<{ tag: string; id: string }>;
}) {
  const params = await props.params;
  const id = Number(params.id);
  const tag = params.tag;

  const startInd = siteConfig.postNumPerPage * (id - 1);
  const endInd = siteConfig.postNumPerPage * id;

  const result = await getPostsLength({ tags: [tag] });
  if (result.isErr()) throw new Error(result.error.message);
  const postsLength = result.value;

  return (
    <>
      <h1 className="scroll-m-20 text-3xl font-semibold tracking-wide text-primary uppercase my-6">
        Posts With Tag:{" "}
        <span className="font-bold text-foreground">{turnTagString(tag)}</span>
      </h1>
      <ListPosts startInd={startInd} endInd={endInd} tags={[tag]} />
      <div className="my-4">
        <PaginationArrows
          totalPages={Math.ceil(postsLength / siteConfig.postNumPerPage)}
          currentId={id}
          href={`/tags/${tag}/page`}
        />
      </div>
      <TotalBlogViews />
      {/* Removing the grid for the tags */}
      {/* <TagsButtonGrid/> */}
    </>
  );
}

export async function generateStaticParams() {
  const result = await getListOfAllTags();
  if (result.isErr()) throw new Error(result.error.message);
  const tags = result.value;

  const ret: { tag: string; id: string }[] = [];

  for (const tag of tags) {
    const result = await getPostsLength({ tags: [tag] });
    if (result.isErr()) throw new Error(result.error.message);
    const tagsMapLength = result.value;
    for (
      let i = 1;
      i <= Math.ceil(tagsMapLength / siteConfig.postNumPerPage);
      i++
    ) {
      ret.push({ tag: tag, id: i.toString() });
    }
  }

  return ret;
}
