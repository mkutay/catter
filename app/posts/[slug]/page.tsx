import Image from 'next/image';
import Link from 'next/link';
import { MDXRemote } from "next-mdx-remote-client/rsc";
import { format } from 'date-fns';
import { Suspense } from 'react';

import ViewCounter from '@/components/viewCounter';
import { ViewCounterFallback } from '@/components/viewCounter';
import DoublePane from '@/components/doublePane';
import CopyToClipboard from '@/components/copyToClipboard';
import { incrementViews } from '@/lib/dataBaseActions';
import { getPostFiles, getProps } from '@/lib/contentQueries';
import { components, options } from '@/lib/mdxRemoteSettings';
import { siteConfig } from '@/config/site';
import { images } from '@/config/images';
import Comments, { CommentsFallback } from '@/components/comments/comments';
import { Skeleton } from '@/components/ui/skeleton';
import { turnTagString } from '@/components/tagsButtonGrid';

export function generateMetadata({ params }: { params: { slug: string } }) {
  const props = getProps('content/posts', params.slug);
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

export default function Page({ params }: { params: { slug: string } }) {
  const props = getProps('content/posts', params.slug);
  const formattedDate = format(props.meta.date, 'PP');

  incrementViews(props.slug);

  return (
    <div>
      <div className="bg-secondary w-screen h-fit py-6 lg:space-y-16 space-y-10">
        <div className="lg:max-w-6xl max-w-prose mx-auto px-4 space-y-2">
          <p className="text-lg font-semibold text-secondary-foreground">
            {formattedDate}
          </p>
          <div className="flex flex-row gap-4">
            {props.meta.tags.map((tag: string) => (
              <p key={tag} className="text-secondary-foreground uppercase text-sm underline hover:text-secondary-foreground/80 transition-all">
                <Link href={`/tags/${tag}/page/1`}>{turnTagString(tag)}</Link>
              </p>
            ))}
          </div>
        </div>
        <div className="lg:max-w-6xl max-w-prose px-4 mx-auto text-secondary-foreground lg:space-y-4 space-y-2">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            {props.meta.title}
          </h1>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            {props.meta.description}
          </p>
        </div>
      </div>
      <DoublePane>
        <header>
          {props.meta.cover && (<div className="my-6"><Image
            alt={`${props.meta.title} post cover image`}
            src={images[props.slug]}
            sizes="100vw"
            style={{ width: "100%", height: "auto" }}
            className="max-w-4xl mx-auto lg:rounded-md rounded-sm lg:shadow-md shadow-sm"
            placeholder="blur"
          /></div>)}
          <div className="my-4 flex flex-row items-center gap-4 justify-end text-foreground text-lg">
            <Suspense fallback={<ViewCounterFallback/>}>
              <ViewCounter slug={props.slug}/>
            </Suspense>
            <CopyToClipboard text={props.meta.shortened}/>
          </div>
        </header>
        <main className="prose">
          <Suspense fallback={<Skeleton className="w-full"/>}>
            <MDXRemote source={props.content} options={options} components={components}/>
          </Suspense>
        </main>
        <Suspense fallback={<CommentsFallback/>}><Comments slug={props.slug}/></Suspense>
      </DoublePane>
    </div>
  );
}

export async function generateStaticParams() {
  const postFiles = getPostFiles();

  return postFiles.map(filename => ({
    slug: filename.replace('.mdx', ''),
  }));
}