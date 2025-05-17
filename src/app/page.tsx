import { MDXRemote } from 'next-mdx-remote-client/rsc';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';

import { components, options } from '@/config/mdxRemoteSettings';
import { getPlaceholder, getPosts } from '@/lib/dbContentQueries';
import { cn } from '@/lib/utils';
import { Post } from '@/config/types';
import { siteConfig } from '@/config/site';
import { ViewDisplay } from '@/components/viewDisplay';
import { TypographyH1, TypographyH2 } from '@/components/typography/headings';
import { TypographyLarge, TypographyParagraph } from '@/components/typography/paragraph';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-static';

export default async function Home() {
  const posts = await getPosts({ });
  const leftSide = posts.filter((post) =>
    siteConfig.homePage.leftSideSlugs.includes(post.slug)
  );
  const rightSide = posts.filter((post) =>
    siteConfig.homePage.rightSideSlugs.includes(post.slug)
  );
  const middle = posts.find((post) =>
    post.slug === siteConfig.homePage.middleSlug
  );

  const firstPost = posts.find((post) =>
    post.slug === siteConfig.homePage.firstSlug
  );

  if (middle === undefined || firstPost === undefined) return;

  const allShownPosts = [middle, ...leftSide, ...rightSide];

  return (
    <div>
      <FirstPost post={firstPost} />
      <div className="bg-primary text-primary-foreground w-full h-fit lg:py-6 py-4">
        <div className="md:max-w-6xl max-w-prose mx-auto px-4 w-full flex md:flex-row flex-col gap-6 md:my-20 my-6">
          <TypographyH1 className="md:w-2/3 w-full">
            Hey, I&apos;m Kutay!
          </TypographyH1>
          <div>
            <TypographyParagraph className="md:text-xl text-lg">
              Welcome to The Deterministic. I share some interesting stuff about mathematics, computer science, and life in general.
            </TypographyParagraph>
          </div>
        </div>
      </div>
      <div className="flex md:flex-row flex-col gap-6 md:max-w-6xl max-w-prose mx-auto px-4 lg:mt-12 mt-4 mb-12">
        <div className="w-1/4 md:flex flex-col gap-12 hidden">
          {leftSide.map((post) => (
            <PostDisplay key={post.slug} post={post} />
          ))}
        </div>
        <div className="w-1/2 md:flex hidden">
          <PostDisplay post={middle} isMiddle />
        </div>
        <div className="w-1/4 md:flex flex-col gap-12 hidden">
          {rightSide.map((post) => (
            <PostDisplay key={post.slug} post={post} />
          ))}
        </div>
        <div className="md:hidden flex flex-col gap-12 w-full">
          {allShownPosts.map((post) => (
            <div key={post.slug}>
              <PostDisplay post={post} isMiddle />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

async function FirstPost({ post }: { post: Post }) {
  const coverImage = post.meta.cover;
  const placeholder = coverImage ? await getPlaceholder(coverImage) : null;
  const coverUrl = coverImage ? coverImage[0] === '/' ? coverImage : `/${coverImage}` : null;

  return (
    <div className="md:max-w-6xl max-w-prose mx-auto px-4 flex md:flex-row flex-col justify-between mt-6 lg:mb-12 mb-4 gap-6">
      {placeholder && coverUrl && <Image
        src={`/api${coverUrl}`}
        alt={`${post.meta.title} post cover image`}
        quality={60}
        className="lg:rounded-md rounded-sm lg:shadow-md shadow-sm md:w-5/12"
        width={placeholder.metadata.width}
        height={placeholder.metadata.height}
        priority={true}
        placeholder={placeholder.base64 as `data:image/${string}`}
      />}
      <div className="flex flex-col gap-4 w-full justify-between">
        <div className="flex flex-col gap-4 w-full">
          <TypographyH2>
            {post.meta.title}
          </TypographyH2>
          <TypographyLarge>
            {post.meta.description}
          </TypographyLarge>
          <MDXRemote source={post.meta.shortExcerpt || post.meta.excerpt} options={options} components={components} />
        </div>
        <div className="flex justify-between flex-row items-center flex-wrap">
          <div className="text-md text-foreground tracking-tight font-light flex flex-col gap-4">
            <ViewDisplay slug={post.slug} />
          </div>
          <div className="text-md text-foreground tracking-tight font-light flex flex-row items-center gap-6 justify-between">
            <p>
              {format(post.meta.date, 'PP')}
            </p>
            <Button asChild variant="outline" className="w-fit" size="lg">
              <Link href={`/posts/${post.slug}`} prefetch={false}>
                Read More
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

async function PostDisplay({
  post,
  isMiddle,
}: {
  post: Post,
  isMiddle?: boolean,
}) {
  const coverImage = post.meta.cover;
  const placeholder = coverImage ? await getPlaceholder(coverImage) : null;
  const coverUrl = coverImage ? coverImage[0] === '/' ? coverImage : `/${coverImage}` : null;

  return (
    <div className={cn("flex flex-col", isMiddle ? "gap-4" : "gap-2")}>
      <Link href={`/posts/${post.slug}`} className={cn("flex flex-col group", isMiddle ? "gap-4" : "gap-2")} prefetch={false}>
        {placeholder && coverUrl && <Image
          src={`/api${coverUrl}`}
          alt={`${post.meta.title} post cover image`}
          quality={60}
          className="lg:rounded-md rounded-sm lg:shadow-md shadow-sm"
          width={placeholder.metadata.width}
          height={placeholder.metadata.height}
          priority={true}
          placeholder={placeholder.base64 as `data:image/${string}`}
        />}
        {isMiddle ? (
          <h2 className="lg:text-5xl/tight md:text-4xl text-4xl font-normal tracking-tighter lg:text-stroke-thick text-stroke-medium text-stroke-background fix-text-stroke">
            <span className="lg:bg-[0%_92%] md:bg-[0%_90%] bg-[0%_89%] bg-gradient-to-r text-foreground from-foreground to-foreground lg:bg-[length:0%_3px] bg-[length:0%_2px] bg-no-repeat lg:group-hover:bg-[length:100%_3px] group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
              {post.meta.title}
            </span>
          </h2>
        ) : (
          <h2 className="scroll-m-20 text-2xl font-medium tracking-tight text-foreground text-stroke-medium text-stroke-background fix-text-stroke">
            <span className="bg-[0%_92%] bg-gradient-to-r from-foreground to-foreground bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
              {post.meta.title}
            </span>
          </h2>
        )}
      </Link>
      {isMiddle && <div className="leading-normal">
        <MDXRemote source={post.meta.shortExcerpt || post.meta.excerpt} options={options} components={components} />
      </div>}
      <div className="text-sm text-foreground tracking-tight font-light flex flex-row justify-between">
        <p>
          {format(post.meta.date, 'PP')}
        </p>
        <ViewDisplay slug={post.slug} />
      </div>
    </div>
  );
}