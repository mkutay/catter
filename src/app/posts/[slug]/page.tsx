import { evaluate, EvaluateOptions, MDXRemote } from 'next-mdx-remote-client/rsc';
import { TocItem } from 'remark-flexible-toc';
import readingTime from 'reading-time';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import path from 'path';

import { components, options } from '@/config/mdxRemoteSettings';
import { siteConfig } from '@/config/site';
import CopyToClipboard from '@/components/copyToClipboard';
import { PostViewCounter } from '@/components/postViewCounter';
import DoublePane from '@/components/doublePane';
import { turnTagString } from '@/components/tagsButtonGrid';
import Comments from '@/components/comments/comments';
import { TypographyH1, TypographyH2 } from '@/components/typography/headings';
import { PostMeta } from '@/config/types';
import { cn } from '@/lib/utils';
import { getPost, getPostSlugs } from '@/lib/dbContentQueries';
import { getPlaceholder } from '@/lib/images';
import { ToggleParentheses } from '@/components/toggleParentheses';

export const dynamic = 'force-static';
// export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getPost(slug);
  if (result.isErr()) throw new Error(result.error.message);
  const props = result.value;

  const formattedDate = format(props.date, 'PP');
  const coverImage = props.cover ? path.join('/api', props.cover) : 'images/favicon.png';

  return {
    title: props.title,
    description: props.description,
    keywords: props.keywords ?? props.tags,
    openGraph: {
      title: props.title,
      description: props.description,
      url: siteConfig.url + '/posts/' + props.slug,
      locale: props.locale,
      type: 'article',
      publishedTime: formattedDate,
      images: [coverImage],
      siteName: siteConfig.name,
    },
  };
}

type Scope = {
  toc?: TocItem[];
};

function EmptyToggleParentheses({ children }: { children: React.ReactNode }) {
  return <>({children})</>;
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getPost(slug);
  if (result.isErr()) throw new Error(result.error.message);
  const props = result.value;

  const formattedDate = format(props.date, 'PP');

  const modifiedOptions: EvaluateOptions<Scope> = {
    ...options,
    vfileDataIntoScope: "toc",
  }

  const modifiedComponents = {
    ...components,
    ToggleParentheses: props.tags.includes(siteConfig.noParentheses) ? EmptyToggleParentheses : ToggleParentheses,
  }

  const time = readingTime(props.content);

  const { content, scope } = await evaluate<PostMeta, Scope>({
    source: props.content,
    options: modifiedOptions,
    components: modifiedComponents
  });

  const coverImage = props.cover;
  const placeholder = coverImage ? await getPlaceholder(coverImage) : null;
  const coverUrl = coverImage ? coverImage[0] === '/' ? coverImage : `/${coverImage}` : null;

  return (
    <>
      <div className="bg-primary w-full h-fit py-6 lg:space-y-14 space-y-10">
        <div className="lg:max-w-6xl max-w-prose mx-auto px-4 space-y-2">
          <p className="text-lg font-semibold text-primary-foreground">
            {formattedDate}
          </p>
          <div className="flex flex-row gap-4">
            {props.tags.map((tag: string) => (
              <p key={tag} className="text-primary-foreground uppercase text-sm underline hover:text-primary-foreground/80 transition-all">
                <Link href={`/tags/${tag}/page/1`}>{turnTagString(tag)}</Link>
              </p>
            ))}
          </div>
        </div>
        <div className="lg:max-w-6xl max-w-prose px-4 mx-auto text-primary-foreground lg:space-y-6 space-y-4">
          <p>{time.text}</p>
          <div className="lg:space-y-5 space-y-3">
            <TypographyH1 className="leading-tight">
              <MDXRemote source={props.title} />
            </TypographyH1>
            <MDXRemote source={props.description} components={modifiedComponents} options={modifiedOptions} />
          </div>
        </div>
      </div>
      <DoublePane side={<Side toc={scope.toc || []} />}>
        <div>
          {coverImage && placeholder && (<div className="my-6"><Image
            alt={`${props.title} post cover image`}
            src={`/api${coverUrl}`}
            className="lg:rounded-md rounded-sm lg:shadow-md shadow-sm"
            width={placeholder.metadata.width}
            height={placeholder.metadata.height}
            priority={true}
            placeholder={placeholder.base64 as `data:image/${string}`}
          /></div>)}
          <div className="my-4 flex flex-row items-center gap-4 justify-end text-foreground text-lg">
            <PostViewCounter slug={props.slug} />
            <CopyToClipboard text={props.shortened} />
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

  const depths = [
    'text-lg/normal',
    'text-lg/tight',
    'text-md/tight',
    'text-sm/tight',
    'text-sm/tight',
    'text-sm/tight',
  ];

  return (
    <div className="flex flex-col gap-4 mt-4 max-w-[300px]">
      <TypographyH2>Table of Contents</TypographyH2>
      <ul className="flex flex-col gap-1.5">
        {toc.map((item, index) => (
          <li key={index}>
            <Link href={`${item.href}`} className="group flex flex-row items-baseline">
              <span className="font-mono mr-2 text-primary group-hover:text-primary/80 transition-all inline-block">
                {"#".repeat(item.depth)}
              </span>
              <span className={cn("text-foreground group-hover:text-foreground/80 transition-all",
                depths[item.depth - 1],
              )}>
                {item.value}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function generateStaticParams() {
  const posts = await getPostSlugs();
  if (posts.isErr()) return [];

  return posts.value.map(slug => ({
    slug,
  }));
}