import { notFound, redirect } from 'next/navigation';
import { format } from 'date-fns';

import { getPosts } from '@/lib/contentQueries';
import { siteConfig } from '@/config/site';

export async function generateMetadata(functionProps: { params: Promise<{ shortened: string }> }) {
  const params = await functionProps.params;
  const { shortened } = params;
  const posts = getPosts({ });

  const props = posts.find((post) => post.meta.shortened == shortened);
  if (!props) notFound();

  const formattedDate = format(props.meta.date, 'PP');

  return {
    title: props.meta.title,
    description: props.meta.description,
    keywords: props.meta.keywords ?? props.meta.tags,
    openGraph: {
      title: props.meta.title,
      description: props.meta.description,
      url: siteConfig.url + '/posts/' + props.slug,
      locale: props.meta.locale,
      type: 'article',
      publishedTime: formattedDate,
      images: [props.meta.coverSquare || 'images/favicon.png'],
      siteName: siteConfig.name,
    },
  };
}

export default async function Page(props: { params: Promise<{ shortened: string }> }) {
  const params = await props.params;
  const { shortened } = params;
  const posts = getPosts({ });

  posts.forEach((post) => {
    if (post.meta.shortened === shortened) {
      redirect(`/posts/${post.slug}`);
    }
  });

  notFound();
}

export function generateStaticParams() {
  const ret: { shortened: string }[] = [];
  const posts = getPosts({ });

  posts.forEach((post) => {
    ret.push({ shortened: post.meta.shortened });
  });

  return ret;
}