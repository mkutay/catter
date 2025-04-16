import { MDXRemote } from 'next-mdx-remote-client/rsc';
import { format } from 'date-fns';

import { getPostFiles, getPostProps } from '@/lib/contentQueries';
import { components, options } from '@/lib/mdxRemoteSettings';
import { incrementViews } from '@/lib/database-actions/views';
import { siteConfig } from '@/config/site';

export const dynamicParams = false; // results in not-found when params that was not generated from generateStaticParams is found

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const props = getPostProps(slug);
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

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const props = getPostProps(slug);

  const incremented = await incrementViews(slug);

  if (incremented.isErr()) {
    if (incremented.error.code === 'DATABASE_ERROR') {
      console.error('Database error in incrementing view:', incremented.error.message);
    } else {
      console.log('Not incrementing views:', incremented.error.message);
    }
  }

  return (
    <main>
      <MDXRemote components={components} options={options} source={props.content} />
    </main>
  );
}

export function generateStaticParams() {
  const postFiles = getPostFiles();

  return postFiles.map(filename => ({
    slug: filename.replace('.mdx', ''),
  }));
}