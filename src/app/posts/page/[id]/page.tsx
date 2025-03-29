import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import PaginationArrows from '@/components/paginationArrows';
import ListPosts from '@/components/listPosts';
import { getBlogViews } from '@/lib/database-queries/views';
import { getPostsLength } from '@/lib/contentQueries';
import { siteConfig } from '@/config/site';

export async function generateMetadata(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = Number(params.id);
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

  if (
    /^-?\d+$/.test(params.id) == false || 
    startInd >= postsLength ||
    endInd <= 0
  ) {
    notFound();
  }

  return (
    <>
      <h1 className="scroll-m-20 text-2xl font-semibold tracking-wide text-primary uppercase my-6">
        List of All Posts and Tags
      </h1>
      <ListPosts startInd={startInd} endInd={endInd} disallowTags={['project']}/>
      <div className="mt-4 mb-8">
        <PaginationArrows totalPages={Math.ceil(postsLength / siteConfig.postNumPerPage)} currentId={id} href="/posts/page"/>
      </div>
      <Suspense fallback={<Skeleton className="h-8 w-[10ch]" />}>
        <TotalBlogViews />
      </Suspense>
      {/* Removing grid for the tags */}
      {/* <TagsButtonGrid/> */}
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

export async function TotalBlogViews() {
  const views = await getBlogViews();

  if (views.isErr()) {
    console.error("Could not display total blog views:", views.error.message);
    return;
  }

  return (
    <div className="flex justify-center items-center text-primary font-bold tracking-tight text-lg">
      {`${views.value} total views`}
    </div>
  );
}