import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';
import { format } from 'date-fns';
import { MDXRemote } from 'next-mdx-remote-client/rsc';

import { getPosts } from '@/lib/contentQueries';
import { components, options } from '@/lib/mdxRemoteSettings';
import { getViewCount } from '@/lib/dataBaseQueries';
import { images } from '@/config/images';
import { postMetaType } from '@/config/schema';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const leftSideSlugs = [
  'why-do-people-just-hate-mathematics',
  'why-mathematics-is-lonely',
];

const rightSideSlugs = [
  'how-to-practice-mathematics-as-an-art',
  'procrastination',
];

const middleSlug = 'creating-a-clone-of-yourself';

export default function Home() {
  const posts = getPosts({ });
  const leftSide = posts.filter((post) =>
    leftSideSlugs.includes(post.slug)
  );
  const rightSide = posts.filter((post) =>
    rightSideSlugs.includes(post.slug)
  );
  const middle = posts.find((post) =>
    post.slug === middleSlug
  );
  if (middle === undefined) return;

  const allShownPosts = [middle, ...leftSide, ...rightSide];

  return (
    <div>
      <div className="bg-primary text-primary-foreground w-full h-fit lg:py-6 py-4">
        <div className="md:max-w-6xl max-w-prose mx-auto px-4 md:mt-32 mt-20">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl w-full text-left">
            Hey! I&apos;m Kutay!
          </h1>
        </div>
      </div>
      <div className="flex md:flex-row flex-col gap-6 md:max-w-6xl max-w-prose mx-auto px-4 lg:mt-6 mt-4 mb-12">
        <div className="w-1/4 md:flex flex-col gap-12 hidden">
          {leftSide.map((post) => (
            <SidePostDisplay key={post.slug} image={images[post.slug]} post={post} />
          ))}
        </div>
        <div className="w-1/2 md:flex hidden">
          <MiddlePostDisplay image={images[middleSlug]} post={middle} />
        </div>
        <div className="w-1/4 md:flex flex-col gap-12 hidden">
          {rightSide.map((post) => (
            <SidePostDisplay key={post.slug} image={images[post.slug]} post={post} />
          ))}
        </div>
        {allShownPosts.map((post) => (
          <div key={post.slug} className="md:hidden flex">
            <MiddlePostDisplay image={images[post.slug]} post={post} />
          </div>
        ))}
      </div>
    </div>
  )
}

function SidePostDisplay({
  post,
  image,
}: {
  post: {
    slug: string;
    content: string;
    meta: postMetaType;
  },
  image: StaticImageData,
}) {
  return (
    <Link href={`/posts/${post.slug}`} className="flex flex-col gap-2 group">
      <Image
        src={image}
        alt={`${post.meta.title} post cover image`}
        sizes="100vw"
        style={{ width: "100%", height: "auto" }}
        className="lg:rounded-md rounded-sm lg:shadow-md shadow-sm"
        placeholder="blur"
      />
      <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight text-foreground text-stroke-medium text-stroke-background fix-text-stroke">
        <span className="bg-[0%_87%] bg-gradient-to-r pb-0.5 from-foreground to-foreground bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
          {post.meta.title}
        </span>
      </h2>
      <div className="text-sm text-foreground tracking-tight font-light flex flex-row justify-between">
        <p>
          {format(post.meta.date, 'PP')}
        </p>
        <Suspense fallback={<ViewDisplayFallback />}>
          <ViewDisplay slug={post.slug} />
        </Suspense>
      </div>
    </Link>
  );
}

function MiddlePostDisplay({
  post,
  image,
}: {
  post: {
    slug: string;
    content: string;
    meta: postMetaType;
  },
  image: StaticImageData,
}) {
  return (
    <div className="flex flex-col gap-4">
      <Link href={`/posts/${post.slug}`} className="flex flex-col gap-4 group">
        <Image
          src={image}
          alt={`${post.meta.title} post cover image`}
          sizes="100vw"
          style={{ width: "100%", height: "auto" }}
          className="lg:rounded-md rounded-sm lg:shadow-md shadow-sm"
          placeholder="blur"
        />
        <h2 className="lg:text-5xl/tight md:text-4xl/tight text-3xl/tight font-normal tracking-tighter text-stroke-medium text-stroke-background fix-text-stroke">
          <span className="lg:bg-[0%_90%] md:bg-[0%_89%] bg-[0%_90%] bg-gradient-to-r text-foreground from-foreground to-foreground lg:bg-[length:0%_3px] bg-[length:0%_2px] bg-no-repeat lg:group-hover:bg-[length:100%_3px] group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
            {post.meta.title}
          </span>
        </h2>
      </Link>
      <div className="prose leading-normal">
        <MDXRemote source={post.meta.shortExcerpt || post.meta.excerpt} options={options} components={components}/>
      </div>
      <div className="text-sm text-foreground tracking-tight font-light flex flex-row justify-between">
        <p>
          {format(post.meta.date, 'PP')}
        </p>
        <Suspense fallback={<ViewDisplayFallback />}>
          <ViewDisplay slug={post.slug} />
        </Suspense>
      </div>
    </div>
  );
}

async function ViewDisplay({ slug }: { slug: string }) {
  return;
  const views = await getViewCount(slug);
  if (views.length === 0) return;

  return (
    <p>
      {views[0].count} views
    </p>
  );
}

function ViewDisplayFallback() {
  return (
    <Skeleton className="h-5 w-16" />
  );
}