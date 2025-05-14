import PaginationArrows from '@/components/paginationArrows';
import ListPosts from '@/components/listPosts';
import { getPostsLength } from '@/lib/contentQueries';
import { siteConfig } from '@/config/site';
import { TotalBlogViews } from '@/components/totalBlogViews';

export const dynamic = 'force-static';
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const postsLength = getPostsLength({ });

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
  const postsLength = getPostsLength({ disallowTags: ['project'] });

  return (
    <>
      <h1 className="scroll-m-20 text-3xl font-semibold tracking-wide text-primary uppercase my-6">
        List of All Posts and Tags
      </h1>
      <ListPosts startInd={startInd} endInd={endInd} disallowTags={['project']}/>
      <div className="mt-4 mb-8">
        <PaginationArrows totalPages={Math.ceil(postsLength / siteConfig.postNumPerPage)} currentId={id} href="/posts/page"/>
      </div>
      <TotalBlogViews />
    </>
  )
}

export async function generateStaticParams() {
  const postsLength = getPostsLength({ disallowTags: ['project'] });
  const ret: { id: string }[] = [];

  for (let i = 1; i <= Math.ceil(postsLength / siteConfig.postNumPerPage); i++) {
    ret.push({ id: i.toString() });
  }

  return ret;
}