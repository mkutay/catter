import Image from 'next/image';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
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
import Comments, { CommentsFallback } from '@/components/comments';

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
      {props.meta.cover && (<div className="pt-2"><Image
        alt={`${props.meta.title} post cover image`}
        src={images[props.slug]}
        sizes="100vw"
        style={{ width: "100%", height: "auto" }}
        className="max-w-4xl mx-auto lg:rounded-md rounded-sm lg:shadow-md shadow-sm"
        placeholder="blur"
      /></div>)}
      <DoublePane>
        <header>
          <h1>
            {props.meta.title}
          </h1>
          {/* <hr/> */}
          <div className="text-lg font-semibold text-text">
            <span>
              {formattedDate}
            </span>
            <span className="px-2 text-xl">
              ·
            </span>
            {props.meta.tags.map((tag: string) => (
              <span key={tag} className="not-prose text-description">
                [<Link href={`/tags/${tag}/page/1`} className="underline hover:italic">{tag}</Link>]
              </span>
            ))}
          </div>
          <div className="my-4 flex flex-row items-center gap-4 justify-end text-foreground text-lg">
            <Suspense fallback={<ViewCounterFallback/>}>
              <ViewCounter slug={props.slug}/>
            </Suspense>
            <CopyToClipboard text={props.meta.shortened}/>
          </div>
          <p className="my-4 italic text-right">
            {props.meta.description}
          </p>
        </header>
        <main>
          <MDXRemote source={props.content} options={options} components={components}/>
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