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
import { TypographyH1 } from '@/components/typography/headings';

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
  if (middle === undefined) return;

  const allShownPosts = [middle, ...leftSide, ...rightSide];

  return (
    <div>
      <div className="bg-primary text-primary-foreground w-full h-fit lg:py-6 py-4">
        <div className="md:max-w-6xl max-w-prose mx-auto px-4 md:mt-32 mt-20">
          <TypographyH1>
            Hey, I&apos;m Kutay!
          </TypographyH1>
        </div>
      </div>
      <div className="flex md:flex-row flex-col gap-6 md:max-w-6xl max-w-prose mx-auto px-4 lg:mt-6 mt-4 mb-12">
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