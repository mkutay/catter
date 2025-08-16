import { MDXRemote } from 'next-mdx-remote-client/rsc';
import { format } from 'date-fns';
import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { components, options } from '@/config/mdxRemoteSettings';
import { getPosts } from '@/lib/dbContentQueries';
import { cn } from '@/lib/utils';
import { Post } from '@/config/types';
import { siteConfig } from '@/config/site';
import { ViewDisplay } from '@/components/viewDisplay';
import { TypographyH1 } from '@/components/typography/headings';
import { TypographyLarge, TypographyParagraph } from '@/components/typography/paragraph';
import { getPlaceholder } from '@/lib/images';
import { TypographyHr } from '@/components/typography/blockquote';
import ProjectCard from '@/components/projectCard';

export const dynamic = 'force-static';

export default async function Home() {
  const result = await getPosts({ });
  if (result.isErr()) throw new Error(result.error.message);
  const posts = result.value;

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
    <div className="flex flex-col gap-6 md:mt-6 mt-0 mb-12">
      <FirstPost post={firstPost} />
      <div className="bg-primary text-primary-foreground w-full h-fit md:py-20 py-8">
        <div className="md:max-w-6xl max-w-prose mx-auto px-4 w-full flex md:flex-row flex-col gap-6 items-center">
          <TypographyH1 className="md:w-2/3 w-full not-italic">
            Hey, I&apos;m <span className="italic">Kutay</span>!
          </TypographyH1>
          <div>
            <TypographyParagraph className="md:text-xl text-lg">
              Welcome to The Deterministic. I share some interesting stuff about mathematics, computer science, and life in general.
            </TypographyParagraph>
          </div>
        </div>
      </div>
      <div className="flex md:flex-row flex-col gap-6 md:max-w-6xl max-w-prose mx-auto px-4">
        <div className="w-1/4 md:flex flex-col gap-12 hidden">
          {leftSide.map((post) => (
            <PostDisplay key={post.slug} post={post} />
          ))}
        </div>
        <div className="md:w-1/2 w-full">
          <PostDisplay post={middle} isMiddle />
        </div>
        <div className="w-1/4 md:flex flex-col gap-12 hidden">
          {rightSide.map((post) => (
            <PostDisplay key={post.slug} post={post} />
          ))}
        </div>
        <div className="md:hidden grid sm:grid-cols-2 grid-cols-1 sm:gap-6 gap-12 w-full">
          {allShownPosts.slice(1).map((post) => (
            <div key={post.slug}>
              <PostDisplay post={post} />
            </div>
          ))}
        </div>
      </div>
      <TypographyHr className="md:my-6 my-3" />
      <Projects projects={posts.filter((post) => post.tags.includes("project"))} />
    </div>
  )
}

async function FirstPost({ post }: { post: Post }) {
  const coverImage = post.cover;
  const placeholder = coverImage ? await getPlaceholder(coverImage) : null;
  const coverUrl = coverImage ? coverImage[0] === '/' ? coverImage : `/${coverImage}` : null;

  return (
    <div className="md:max-w-6xl max-w-prose mx-auto px-4 flex md:flex-row flex-col justify-between gap-6 items-center">
      {placeholder && coverUrl && <Image
        src={`/api${coverUrl}`}
        alt={`${post.title} post cover image`}
        quality={60}
        className="lg:rounded-md rounded-sm lg:shadow-md shadow-sm lg:max-w-lg md:max-w-sm w-full object-contain"
        width={placeholder.metadata.width}
        height={placeholder.metadata.height}
        priority={true}
        placeholder={placeholder.base64 as `data:image/${string}`}
      />}
      <div className="flex flex-col gap-4 w-full justify-between">
        <div className="flex flex-col md:gap-4 gap-2 w-full">
          <Link className="group flex flex-col gap-2" href={`/posts/${post.slug}`}>
            <h1 className="lg:text-6xl/tight md:text-5xl text-4xl font-normal tracking-tighter text-stroke-medium text-stroke-background fix-text-stroke">
              <span className="lg:bg-[0%_93%] md:bg-[0%_90%] bg-[0%_89%] bg-gradient-to-r text-foreground from-foreground to-foreground lg:bg-[length:0%_3px] bg-[length:0%_2px] bg-no-repeat lg:group-hover:bg-[length:100%_3px] group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                {post.title}
              </span>
            </h1>
            <TypographyLarge>
              {post.description}
            </TypographyLarge>
          </Link>
          <MDXRemote source={post.shortExcerpt || post.excerpt} options={options} components={components} />
        </div>
        <div className="flex justify-between flex-row items-center flex-wrap text-md text-foreground tracking-tight font-light">
          <ViewDisplay slug={post.slug} />
          <p>
            {format(post.date, 'PP')}
          </p>
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
  const coverImage = post.cover;
  const placeholder = coverImage ? await getPlaceholder(coverImage) : null;
  const coverUrl = coverImage ? coverImage[0] === '/' ? coverImage : `/${coverImage}` : null;

  return (
    <div className={cn("flex flex-col", isMiddle ? "gap-4" : "gap-2")}>
      <Link href={`/posts/${post.slug}`} className={cn("flex flex-col group", isMiddle ? "gap-4" : "gap-2")} prefetch={false}>
        {placeholder && coverUrl && <Image
          src={`/api${coverUrl}`}
          alt={`${post.title} post cover image`}
          quality={60}
          className="lg:rounded-md rounded-sm lg:shadow-md shadow-sm"
          width={placeholder.metadata.width}
          height={placeholder.metadata.height}
          priority={true}
          placeholder={placeholder.base64 as `data:image/${string}`}
        />}
        {isMiddle ? (
          <h2 className="lg:text-5xl/tight md:text-4xl text-4xl font-normal tracking-tighter text-stroke-medium text-stroke-background fix-text-stroke">
            <span className="lg:bg-[0%_93%] md:bg-[0%_90%] bg-[0%_89%] bg-gradient-to-r text-foreground from-foreground to-foreground lg:bg-[length:0%_3px] bg-[length:0%_2px] bg-no-repeat lg:group-hover:bg-[length:100%_3px] group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
              {post.title}
            </span>
          </h2>
        ) : (
          <h2 className="scroll-m-20 text-2xl font-medium tracking-tight text-foreground text-stroke-medium text-stroke-background fix-text-stroke">
            <span className="bg-[0%_93%] bg-gradient-to-r from-foreground to-foreground bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
              {post.title}
            </span>
          </h2>
        )}
      </Link>
      {isMiddle && <div className="leading-normal">
        <MDXRemote source={post.shortExcerpt || post.excerpt} options={options} components={components} />
      </div>}
      <div className="text-sm text-foreground tracking-tight font-light flex flex-row justify-between">
        <p>
          {format(post.date, 'PP')}
        </p>
        <Suspense>
          <ViewDisplay slug={post.slug} />
        </Suspense>
      </div>
    </div>
  );
}

function Projects({ projects }: { projects: Post[] }) {
  return (
    <div className="md:max-w-6xl max-w-prose mx-auto w-full px-4">
      <TypographyH1 className="mb-8">
        Projects
      </TypographyH1>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.slug} props={project} />
        ))}
      </div>
    </div>
  );
}