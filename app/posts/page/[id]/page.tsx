import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import TagsButtonGrid from '@/components/tagsButtonGrid';
import PaginationArrows from '@/components/paginationArrows';
import ListPosts from '@/components/listPosts';
import DoublePane from '@/components/doublePane';
import { TotalBlogViews } from '@/components/totalBlogViews';
import { getPostsLength } from '@/lib/contentQueries';
import { siteConfig } from '@/config/site';

export function generateMetadata({ params }: { params: { id: string } }) {
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

export default function Page({ params }: { params: { id: string } }) {
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
    <DoublePane>
      <h1>
        List of All Posts and Tags
      </h1>
      <ListPosts startInd={startInd} endInd={endInd} disallowTags={['project']}/>
      <PaginationArrows totalPages={Math.ceil(postsLength / siteConfig.postNumPerPage)} currentId={id} href="/posts/page"/>
      <hr/>
      <TagsButtonGrid/>
      <div className="mt-8">
        <Suspense fallback={<Skeleton className="h-8 w-[10ch]"/>}>
          <TotalBlogViews/>
        </Suspense>
      </div>
    </DoublePane>
  )
}

export async function generateStaticParams() {
  const postsLength = getPostsLength({ disallowTags: ['project'] });
  let ret: {id: string}[] = [];

  for (let i = 1; i <= Math.ceil(postsLength / siteConfig.postNumPerPage); i++) {
    ret.push({ id: i.toString() });
  }

  return ret;
}