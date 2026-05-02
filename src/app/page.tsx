import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import { Suspense } from "react";
import { TypographyH1 } from "@/components/typography/headings";
import {
  TypographyLarge,
  TypographyParagraph,
} from "@/components/typography/paragraph";
import { ViewDisplay } from "@/components/viewDisplay";
import { components, options } from "@/config/mdxRemoteSettings";
import { siteConfig } from "@/config/site";
import type { Post } from "@/config/types";
import { getPosts } from "@/lib/dbContentQueries";
import { getPlaceholder } from "@/lib/images";
import { cn } from "@/lib/utils";

export const dynamic = "force-static";

export default async function Home() {
  const result = await getPosts({});
  if (result.isErr()) throw new Error(result.error.message);
  const posts = result.value;

  const leftSide = posts.filter((post) =>
    siteConfig.homePage.leftSideSlugs.includes(post.slug),
  );
  const rightSide = posts.filter((post) =>
    siteConfig.homePage.rightSideSlugs.includes(post.slug),
  );
  const middle = posts.find(
    (post) => post.slug === siteConfig.homePage.middleSlug,
  );

  const firstPost = posts.find(
    (post) => post.slug === siteConfig.homePage.firstSlug,
  );

  if (middle === undefined || firstPost === undefined) return;

  const allShownPosts = [middle, ...leftSide, ...rightSide];

  const recentNotDisplayed = posts.filter(
    (post) =>
      !allShownPosts.some((displayed) => displayed.slug === post.slug) &&
      !siteConfig.homePage.firstSlug.includes(post.slug),
  );

  return (
    <div>
      <section className="pt-12 md:pt-20 py-16 md:py-24">
        <FirstPost post={firstPost} />
      </section>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-primary/2 to-transparent" />
        <div className="relative bg-primary/95 backdrop-blur-xs text-primary-foreground">
          <div className="md:max-w-6xl max-w-prose mx-auto px-4 py-16 md:py-24">
            <div className="flex md:flex-row flex-col md:gap-0 gap-8 items-center">
              <div className="md:w-3/5 w-full">
                <TypographyH1 className="not-italic text-5xl md:text-6xl lg:text-7xl font-light tracking-tight">
                  Hey, I&apos;m{" "}
                  <span className="italic font-normal bg-linear-to-r from-primary-foreground to-primary-foreground/80 bg-clip-text">
                    Kutay
                  </span>
                  !
                </TypographyH1>
              </div>
              <div className="md:w-2/5 w-full">
                <TypographyParagraph className="text-lg md:text-xl leading-relaxed text-primary-foreground/90">
                  Welcome to The Deterministic. I share thoughts on mathematics,
                  computer science, and the patterns that connect them.
                </TypographyParagraph>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="md:max-w-6xl max-w-prose mx-auto px-4 flex flex-col md:gap-8 gap-6">
          <div className="flex md:flex-row flex-col gap-8">
            {/* Left Sidebar */}
            <aside className="w-full md:w-1/4 hidden md:block space-y-12">
              {leftSide.map((post) => (
                <Suspense key={post.slug}>
                  <PostDisplay post={post} />
                </Suspense>
              ))}
            </aside>

            {/* Main Content */}
            <main className="md:w-1/2 w-full">
              <Suspense>
                <PostDisplay post={middle} isMiddle />
              </Suspense>
            </main>

            {/* Right Sidebar */}
            <aside className="w-full md:w-1/4 hidden md:block space-y-12">
              {rightSide.map((post) => (
                <Suspense key={post.slug}>
                  <PostDisplay post={post} />
                </Suspense>
              ))}
            </aside>

            {/* Mobile Grid */}
            <div className="md:hidden grid sm:grid-cols-2 grid-cols-1 gap-6 w-full">
              {allShownPosts.slice(1).map((post) => (
                <Suspense key={post.slug}>
                  <PostDisplay post={post} isMiddle />
                </Suspense>
              ))}
            </div>
          </div>
          <div className="flex md:flex-row flex-col md:gap-8 gap-6">
            {recentNotDisplayed.slice(0, 3).map((post) => (
              <Suspense key={post.slug}>
                <PostDisplay post={post} />
              </Suspense>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

async function FirstPost({ post }: { post: Post }) {
  const coverImage = post.cover;
  const placeholder = coverImage ? await getPlaceholder(coverImage) : null;
  const coverUrl = coverImage
    ? coverImage[0] === "/"
      ? coverImage
      : `/${coverImage}`
    : null;

  return (
    <div className="md:max-w-6xl max-w-prose mx-auto px-4">
      <div className="grid md:grid-cols-2 grid-cols-1 gap-6 md:gap-8 md:min-h-100">
        {/* Image Container */}
        {placeholder && coverUrl && (
          <div className="w-full">
            <Image
              src={`/api${coverUrl}`}
              alt={`${post.title} post cover image`}
              quality={75}
              className="lg:rounded-md rounded-sm lg:shadow-md shadow-sm w-full h-full object-cover"
              width={placeholder.metadata.width}
              height={placeholder.metadata.height}
              priority={true}
              placeholder={placeholder.base64 as `data:image/${string}`}
            />
          </div>
        )}

        {/* Content Container */}
        <div className="w-full flex flex-col gap-6">
          <div className="grow space-y-6">
            <Link
              className="group block"
              href={`/posts/${post.slug}`}
              prefetch={false}
            >
              <h1 className="lg:text-6xl/tight md:text-5xl text-4xl font-normal tracking-tighter text-stroke-medium text-stroke-background fix-text-stroke">
                <span className="lg:bg-position-[0%_93%] md:bg-position-[0%_90%] bg-position-[0%_89%] bg-linear-to-r text-foreground from-foreground to-foreground lg:bg-size-[0%_3px] bg-size-[0%_2px] bg-no-repeat lg:group-hover:bg-size-[100%_3px] group-hover:bg-size-[100%_2px] transition-all duration-500 ease-out">
                  {post.title}
                </span>
              </h1>
            </Link>
            <TypographyLarge className="mt-4 text-muted-foreground">
              {post.description}
            </TypographyLarge>

            <div className="max-w-none text-muted-foreground">
              <MDXRemote
                source={post.shortExcerpt || post.excerpt}
                options={options}
                components={components}
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-6 text-sm text-muted-foreground border-t border-border/50 mt-auto">
            <time dateTime={post.date}>
              {format(new Date(post.date), "PPP")}
            </time>
            <Suspense>
              <ViewDisplay slug={post.slug} />
            </Suspense>
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
  post: Post;
  isMiddle?: boolean;
}) {
  const coverImage = post.cover;
  const placeholder = coverImage ? await getPlaceholder(coverImage) : null;
  const coverUrl = coverImage
    ? coverImage[0] === "/"
      ? coverImage
      : `/${coverImage}`
    : null;

  return (
    <div className={cn("flex flex-col", isMiddle ? "gap-4" : "gap-2")}>
      <Link
        href={`/posts/${post.slug}`}
        className={cn("flex flex-col group", isMiddle ? "gap-4" : "gap-2")}
        prefetch={false}
      >
        {placeholder && coverUrl && (
          <Image
            src={`/api${coverUrl}`}
            alt={`${post.title} post cover image`}
            quality={75}
            className="lg:rounded-md rounded-sm lg:shadow-md shadow-xs"
            width={placeholder.metadata.width}
            height={placeholder.metadata.height}
            priority={true}
            placeholder={placeholder.base64 as `data:image/${string}`}
          />
        )}
        {isMiddle ? (
          <h2 className="lg:text-5xl/tight md:text-4xl text-4xl font-normal tracking-tighter text-stroke-medium text-stroke-background fix-text-stroke">
            <span className="lg:bg-position-[0%_93%] md:bg-position-[0%_90%] bg-position-[0%_89%] bg-linear-to-r text-foreground from-foreground to-foreground lg:bg-size-[0%_3px] bg-size-[0%_2px] bg-no-repeat lg:group-hover:bg-size-[100%_3px] group-hover:bg-size-[100%_2px] transition-all duration-500 ease-out">
              {post.title}
            </span>
          </h2>
        ) : (
          <h2 className="scroll-m-20 text-2xl font-medium tracking-tight text-foreground text-stroke-medium text-stroke-background fix-text-stroke">
            <span className="bg-position-[0%_93%] bg-linear-to-r from-foreground to-foreground bg-size-[0%_2px] bg-no-repeat group-hover:bg-size-[100%_2px] transition-all duration-500 ease-out">
              {post.title}
            </span>
          </h2>
        )}
      </Link>
      {isMiddle && (
        <div className="leading-normal">
          <MDXRemote
            source={post.shortExcerpt || post.excerpt}
            options={options}
            components={components}
          />
        </div>
      )}
      <div className="text-sm text-foreground tracking-tight font-light flex flex-row justify-between">
        <p>{format(post.date, "PP")}</p>
        <Suspense>
          <ViewDisplay slug={post.slug} />
        </Suspense>
      </div>
    </div>
  );
}
