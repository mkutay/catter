import PaginationArrows from '@/components/paginationArrows';
import ListPosts from '@/components/listPosts';
import { turnTagString } from '@/components/tagsButtonGrid';
import { getPosts, getPostsLength, getListOfAllTags } from '@/lib/contentQueries';
import { siteConfig } from '@/config/site';
import { TotalBlogViews } from '@/components/totalBlogViews';

export const dynamic = 'force-static';
export const dynamicParams = false;

export async function generateMetadata(props: { params: Promise<{ tag: string, id: string }> }) {
  const params = await props.params;
  const { id, tag } = params;
  const posts = getPosts({ tags: [tag] });

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

export default async function Page(props: { params: Promise<{ tag: string, id: string }> }) {
  const params = await props.params;
  const id = Number(params.id);
  const tag = params.tag;

  const startInd = siteConfig.postNumPerPage * (id - 1);
  const endInd = siteConfig.postNumPerPage * id;
  const postsLength = getPostsLength({ tags: [tag] });

  return (
    <>
      <h1 className="scroll-m-20 text-3xl font-semibold tracking-wide text-primary uppercase my-6">
        Posts With Tag: <span className="font-bold text-foreground">{turnTagString(tag)}</span>
      </h1>
      <ListPosts startInd={startInd} endInd={endInd} tags={[tag]}/>
      <div className="mt-4 mb-8">
        <PaginationArrows totalPages={Math.ceil(postsLength / siteConfig.postNumPerPage)} currentId={id} href={`/tags/${tag}/page`}/>
      </div>
      <TotalBlogViews />
      {/* Removing the grid for the tags */}
      {/* <TagsButtonGrid/> */}
    </>
  )
}

export async function generateStaticParams() {
  const tags = getListOfAllTags();
  const ret: { tag: string, id: string }[] = [];

  tags.forEach((tag) => {
    const tagsMapLength = getPostsLength({ tags: [tag] });
    for (let i = 1; i <= Math.ceil(tagsMapLength / siteConfig.postNumPerPage); i++) {
      ret.push({ tag: tag, id: i.toString() });
    }
  })

  return ret;
}