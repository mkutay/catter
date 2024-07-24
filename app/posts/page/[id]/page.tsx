import { notFound } from 'next/navigation';

import { getPostsLength } from '@/lib/postQueries';
import { siteConfig } from '@/config/site';
import TagsButtonGrid from '@/components/tagsButtonGrid';
import PaginationArrows from '@/components/paginationArrows';
import EmailSubButton from '@/components/emailSubButton';
import ListPosts from '@/components/listPosts';

export function generateMetadata({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const postsLength = getPostsLength();

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
  const postsLength = getPostsLength();

  if (
    /^-?\d+$/.test(params.id) == false || 
    startInd >= postsLength ||
    endInd <= 0
  ) {
    notFound();
  }

  return (
    <section className="max-w-prose mx-auto my-0 py-8 prose px-4 lg:px-8 prose-h1:my-0">
      <h1>
        List of All Posts and Tags
      </h1>
      <hr/>
      <ListPosts startInd={startInd} endInd={endInd}/>
      <hr/>
      <PaginationArrows totalPages={Math.ceil(postsLength / siteConfig.postNumPerPage)} currentId={id} href="/posts/page"/>
      <hr/>
      <EmailSubButton/>
      <hr/>
      <TagsButtonGrid/>
    </section>
  )
}

export async function generateStaticParams() {
  const postsLength = getPostsLength();

  let ret: {id: string}[] = [];
  for (let i = 1; i <= Math.ceil(postsLength / siteConfig.postNumPerPage); i++) {
    ret.push({ id: i.toString() });
  }

  return ret;
}