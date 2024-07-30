import { notFound, redirect } from 'next/navigation';

import { getPostFiles, getProps, getPosts } from '@/lib/contentQueries';

export default function Page({ params }: { params: { shortened: string } }) {
  const { shortened } = params;
  const posts = getPosts({ });
  const projects = getPosts({ tags: ['project'] });
  
  posts.forEach((post) => {
    if (post.meta.shortened === shortened) {
      redirect(`/posts/${post.slug}`);
    }
  });

  projects.forEach((post) => {
    if (post.meta.shortened === shortened) {
      redirect(`/posts/${post.slug}`);
    }
  });

  notFound();
}

export function generateStaticParams() {
  const ret: { shortened: string }[] = [];
  const posts = getPosts({ });
  const projects = getPosts({ tags: ['project'] });

  posts.forEach((post) => {
    ret.push({ shortened: post.meta.shortened });
  });

  projects.forEach((post) => {
    ret.push({ shortened: post.meta.shortened });
  });

  return ret;
}