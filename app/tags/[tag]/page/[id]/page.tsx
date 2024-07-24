import { notFound } from 'next/navigation';

import { getPosts, getPostsLength, getListOfAllTags } from '@/lib/postQueries';
import { siteConfig } from '@/config/site';
import PaginationArrows from '@/components/paginationArrows';
import TagsButtonGrid, { turnTagString } from '@/components/tagsButtonGrid';
import EmailSubButton from '@/components/emailSubButton';
import ListPosts from '@/components/listPosts';
import DoublePane from '@/components/doublePane';

export function generateMetadata({ params }: { params: { tag: string, id: string } }) {
  const { id, tag } = params;
  const posts = getPosts({ tag });

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
  const postsLength = getPostsLength(tag);
  
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
        Posts With Tag: <span className="text-[#1e66f5] dark:text-[#89b4fa]">{turnTagString(tag)}</span>
      </h1>
      <hr/>
      <ListPosts startInd={startInd} endInd={endInd} tag={tag}/>
      <hr/>
      <PaginationArrows totalPages={Math.ceil(postsLength / siteConfig.postNumPerPage)} currentId={id} href={`/tags/${tag}/page`}/>
      <hr/>
      <TagsButtonGrid/>
    </DoublePane>
  )
}

export async function generateStaticParams() {
  let ret: { tag: string, id: string }[] = [];
  const tags = getListOfAllTags();

  tags.forEach((tag) => {
    const tagsMapLength = getPostsLength(tag);
    for (let i = 1; i <= Math.ceil(tagsMapLength / siteConfig.postNumPerPage); i++) {
      ret.push({ tag: tag, id: i.toString() });
    }
  })

  return ret;
}