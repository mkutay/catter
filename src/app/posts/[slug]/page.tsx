import { MDXRemote } from 'next-mdx-remote-client/rsc';
import { format } from 'date-fns';

import { getPostFiles, getPostProps } from '@/lib/contentQueries';
import { components, options } from '@/lib/mdxRemoteSettings';
import { incrementViews } from '@/lib/database-actions/views';
import { siteConfig } from '@/config/site';
import Comments from '@/components/comments/comments';
import CopyToClipboard from '@/components/copyToClipboard';
import { PostViewCounter } from '@/components/postViewCounter';
import Image from 'next/image';
import DoublePane from '@/components/doublePane';
import { turnTagString } from '@/components/tagsButtonGrid';
import Link from 'next/link';
import { images } from '@/config/images';

export const dynamicParams = false; // results in not-found when params that was not generated from generateStaticParams is found
export const revalidate = 60; // seconds

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
  const formattedDate = format(props.meta.date, 'PP');

  const incremented = await incrementViews(slug);

  if (incremented.isErr()) {
    if (incremented.error.code === 'DATABASE_ERROR') {
      console.error('Database error in incrementing view:', incremented.error.message);
    } else {
      console.log('Not incrementing views:', incremented.error.message);
    }
  }

  return (
    <>
      <div className="bg-primary w-full h-fit py-6 lg:space-y-16 space-y-10">
        <div className="lg:max-w-6xl max-w-prose mx-auto px-4 space-y-2">
          <p className="text-lg font-semibold text-primary-foreground">
            {formattedDate}
          </p>
          <div className="flex flex-row gap-4">
            {props.meta.tags.map((tag: string) => (
              <p key={tag} className="text-primary-foreground uppercase text-sm underline hover:text-primary-foreground/80 transition-all">
                <Link href={`/tags/${tag}/page/1`}>{turnTagString(tag)}</Link>
              </p>
            ))}
          </div>
        </div>
        <div className="lg:max-w-6xl max-w-prose px-4 mx-auto text-primary-foreground lg:space-y-4 space-y-2">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            {props.meta.title}
          </h1>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            {props.meta.description}
          </p>
        </div>
      </div>
      <DoublePane>
        <div>
          {props.meta.cover && (<div className="my-6"><Image
            alt={`${props.meta.title} post cover image`}
            src={images[props.slug]}
            sizes="100vw"
            style={{ width: "100%", height: "auto" }}
            className="max-w-4xl mx-auto lg:rounded-md rounded-sm lg:shadow-md shadow-sm"
            placeholder="blur"
          /></div>)}
          <div className="my-4 flex flex-row items-center gap-4 justify-end text-foreground text-lg">
            <PostViewCounter slug={props.slug} />
            <CopyToClipboard text={props.meta.shortened} />
          </div>
        </div>
        <main>
          <MDXRemote components={components} options={options} source={props.content} />
        </main>
        <Comments slug={props.slug}/>
      </DoublePane>
    </>
  );
}

export function generateStaticParams() {
  const postFiles = getPostFiles();

  return postFiles.map(filename => ({
    slug: filename.replace('.mdx', ''),
  }));
}