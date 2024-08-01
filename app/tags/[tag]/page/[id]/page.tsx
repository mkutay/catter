import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import PaginationArrows from '@/components/paginationArrows';
import ListPosts from '@/components/listPosts';
import DoublePane from '@/components/doublePane';
import { TotalBlogViews } from '@/components/totalBlogViews';
import TagsButtonGrid, { turnTagString } from '@/components/tagsButtonGrid';
import { getPosts, getPostsLength, getListOfAllTags } from '@/lib/contentQueries';
import { siteConfig } from '@/config/site';

export function generateMetadata({ params }: { params: { tag: string, id: string } }) {
  const { id, tag } = params;
  const posts = getPosts({ tags: [tag] });

  return {
    title: `Posts With Tag: ${tag} | Page ${id}`,
    description: `List of all the tags that posts have on Kutay's Blog, currently displaying tag ${tag} on page ${id} out of ${Math.ceil(posts.length / siteConfig.postNumPerPage)}.`,
    openGraph: {
      title: `Posts With Tag: ${tag} | Page ${id}`,
      description: `List of all the tags that posts have on Kutay's Blog, currently displaying tag ${tag} on page ${id} out of ${Math.ceil(posts.length / siteConfig.postNumPerPage)}.`,
      url: `${siteConfig.url}/tags/${tag}/page/${id}`,
    },
  };
}

export default function Page({ params }: { params: { tag: string, id: string } }) {
  const id = Number(params.id);
  const tag = params.tag;

  const startInd = siteConfig.postNumPerPage * (id - 1);
  const endInd = siteConfig.postNumPerPage * id;
  const postsLength = getPostsLength({ tags: [tag] });
  
  if (
    /^-?\d+$/.test(params.id) == false || 
    startInd >= postsLength ||
    endInd <= 0 ||
    getListOfAllTags().includes(tag) == false
  ) {
    notFound();
  }

  return (
    <DoublePane>
      <h1>
        Posts With Tag: <span className="text-secondary">{turnTagString(tag)}</span>
      </h1>
      <ListPosts startInd={startInd} endInd={endInd} tags={[tag]}/>
      <PaginationArrows totalPages={Math.ceil(postsLength / siteConfig.postNumPerPage)} currentId={id} href={`/tags/${tag}/page`}/>
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