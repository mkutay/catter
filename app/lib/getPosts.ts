import { getPostFiles } from '@/app/lib/getPostFiles';
import getProps from '@/app/lib/getProps';

export default function getPosts({
  startInd,
  endInd,
  tag,
}: {
  startInd?: number,
  endInd?: number,
  tag?: string
}) { // half-open interval, ie. [startInd, endInd)
  startInd = startInd ?? 0;
  endInd = endInd ?? 100000;

  const postFiles = getPostFiles();

  let posts: {
    slug: string,
    content: string,
    meta: { [key: string]: any },
  }[] = [];
  
  postFiles.forEach((filename) => {
    const slug = filename.replace('.mdx', '');
    const props = getProps('content/posts', slug);

    if (typeof tag == 'undefined') {
      posts.push(props);
    } else if (props.meta.tags.includes(tag)) {
      posts.push(props);
    }
  });

  posts.sort((a, b) => (
    new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()
  ));

  return posts.slice(startInd, endInd);
}

export function getPostsLength(tag?: string) {
  if (typeof tag == 'undefined') {
    return getPostFiles().length;
  }
  return getPosts({ tag }).length;
}