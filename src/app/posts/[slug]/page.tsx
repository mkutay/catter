import { evaluate } from 'next-mdx-remote-client/rsc';
import { TocItem } from 'remark-flexible-toc';
import readingTime, { ReadTimeResults } from 'reading-time';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';

import { getPostFiles, getPostProps } from '@/lib/contentQueries';
import { components, options } from '@/config/mdxRemoteSettings';
import { siteConfig } from '@/config/site';
import CopyToClipboard from '@/components/copyToClipboard';
import { PostViewCounter } from '@/components/postViewCounter';
import DoublePane from '@/components/doublePane';
import { turnTagString } from '@/components/tagsButtonGrid';
import { images } from '@/config/images';
import Comments from '@/components/comments/comments';
import { TypographyH1, TypographyH2 } from '@/components/typography/headings';
import { PostMeta } from '@/config/types';
import { cn } from '@/lib/utils';

export const dynamic = 'force-static';
export const dynamicParams = false;

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

type Scope = {
  readingTime: ReadTimeResults;
  toc?: TocItem[];
};

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const props = getPostProps(slug);
  const formattedDate = format(props.meta.date, 'PP');

  const modifiedOptions = {
    ...options,
    scope: {
      readingTime: readingTime(props.content),
    },
    vfileDataIntoScope: "toc",
  }

  const { content, scope } = await evaluate<PostMeta, Scope>({
    source: props.content,
    options: modifiedOptions,
    components,
  });

  return (
    <>
      <div className="bg-primary w-full h-fit py-6 lg:space-y-14 space-y-10">
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
        <div className="lg:max-w-6xl max-w-prose px-4 mx-auto text-primary-foreground lg:space-y-2 space-y-1">
          <p>{scope.readingTime.text}</p>
          <div className="lg:space-y-4 space-y-2">
            <TypographyH1>{props.meta.title}</TypographyH1>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              {props.meta.description}
            </p>
          </div>
        </div>
      </div>
      <DoublePane side={<Side toc={scope.toc || []} />}>
        <div>
          {props.meta.cover && (<div className="my-6"><Image
            alt={`${props.meta.title} post cover image`}
            src={images[props.slug]}
            className="lg:rounded-md rounded-sm lg:shadow-md shadow-sm"
            placeholder="blur"
          /></div>)}
          <div className="my-4 flex flex-row items-center gap-4 justify-end text-foreground text-lg">
            <PostViewCounter slug={props.slug} />
            <CopyToClipboard text={props.meta.shortened} />
          </div>
        </div>
        <main>
          {content}
        </main>
        <Comments slug={props.slug} />
      </DoublePane>
    </>
  );
}

function Side({ toc }: { toc: TocItem[] }) {
  if (toc.length === 0) return null;
  return (
    <div className="flex flex-col gap-4 mt-4 max-w-[300px]">
      <TypographyH2>Table of Contents</TypographyH2>
      <ul className="flex flex-col gap-2">
        {toc.map((item, index) => (
          <li key={index}>
            <span className="inline-block w-4" />
            <Link href={`${item.href}`} className={cn("text-foreground hover:text-foreground/80 transition-all",
              item.depth === 2 ? "text-lg/tight" : item.depth === 3 ? "text-md/tight" : item.depth === 4 ? "text-sm/tight" : "text-sm/tight"
            )}>
              {item.value}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function generateStaticParams() {
  const postFiles = getPostFiles();

  return postFiles.map(filename => ({
    slug: filename.replace('.mdx', ''),
  }));
}