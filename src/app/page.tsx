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
import ProjectCard from '@/components/projectCard';
import { Button } from '@/components/ui/button';

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
                  Hey, I&apos;m{' '}
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
        <div className="md:max-w-6xl max-w-prose mx-auto px-4">
          <div className="flex md:flex-row flex-col gap-8">
            {/* Left Sidebar */}
            <aside className="w-full md:w-1/4 hidden md:block space-y-12">
              {leftSide.map((post) => (
                <PostDisplay key={post.slug} post={post} />
              ))}
            </aside>

            {/* Main Content */}
            <main className="md:w-1/2 w-full">
              <PostDisplay post={middle} isMiddle />
            </main>

            {/* Right Sidebar */}
            <aside className="w-full md:w-1/4 hidden md:block space-y-12">
              {rightSide.map((post) => (
                <PostDisplay key={post.slug} post={post} />
              ))}
            </aside>

            {/* Mobile Grid */}
            <div className="md:hidden grid sm:grid-cols-2 grid-cols-1 gap-6 w-full">
              {allShownPosts.slice(1).map((post) => (
                <PostDisplay key={post.slug} post={post} isMiddle />
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="md:max-w-6xl max-w-prose mx-auto px-4">
        <div className="h-px bg-linear-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Projects Section */}
      <section className="py-16 md:py-24">
        <Projects projects={posts.filter((post) => post.tags.includes("project"))} />
      </section>

      <div className="md:max-w-6xl max-w-prose mx-auto px-4">
        <div className="h-px bg-linear-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Recent Posts Section */}
      <section className="py-16 md:py-24">
        <RecentPosts 
          posts={posts
            .filter((post) => 
              !allShownPosts.includes(post) && 
              siteConfig.homePage.firstSlug !== post.slug && 
              !post.tags.includes("project")
            )
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5)
          }
        />
      </section>
    </div>
  )
}

async function FirstPost({ post }: { post: Post }) {
  const coverImage = post.cover;
  const placeholder = coverImage ? await getPlaceholder(coverImage) : null;
  const coverUrl = coverImage ? coverImage[0] === '/' ? coverImage : `/${coverImage}` : null;

  return (
    <div className="md:max-w-6xl max-w-prose mx-auto px-4">
      <div className="grid md:grid-cols-2 grid-cols-1 gap-6 md:gap-8 md:min-h-[400px]">
        {/* Image Container */}
        {placeholder && coverUrl && (
          <div className="w-full">
            <Image
              src={`/api${coverUrl}`}
              alt={`${post.title} post cover image`}
              quality={60}
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
          <div className="flex-grow space-y-6">
            <Link className="group block" href={`/posts/${post.slug}`}>
              <h1 className="lg:text-6xl/tight md:text-5xl text-4xl font-normal tracking-tighter text-stroke-medium text-stroke-background fix-text-stroke">
                <span className="lg:bg-[0%_93%] md:bg-[0%_90%] bg-[0%_89%] bg-gradient-to-r text-foreground from-foreground to-foreground lg:bg-[length:0%_3px] bg-[length:0%_2px] bg-no-repeat lg:group-hover:bg-[length:100%_3px] group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                  {post.title}
                </span>
              </h1>
              <TypographyLarge className="mt-4 text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                {post.description}
              </TypographyLarge>
            </Link>

            <div className="max-w-none text-muted-foreground">
              <MDXRemote source={post.shortExcerpt || post.excerpt} options={options} components={components} />
            </div>
          </div>

          <div className="flex justify-between items-center pt-6 text-sm text-muted-foreground border-t border-border/50 mt-auto">
            <time dateTime={post.date}>
              {format(new Date(post.date), 'PPP')}
            </time>
            <ViewDisplay slug={post.slug} />
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
          className="lg:rounded-md rounded-sm lg:shadow-md shadow-xs"
          width={placeholder.metadata.width}
          height={placeholder.metadata.height}
          priority={true}
          placeholder={placeholder.base64 as `data:image/${string}`}
        />}
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
    <div className="md:max-w-6xl max-w-prose mx-auto px-4">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-4xl md:text-5xl font-light italic tracking-tight text-foreground/90">
          Projects
        </h2>
        <div className="w-24 h-px bg-linear-to-r from-transparent via-primary to-transparent mx-auto mt-6" />
      </div>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
        {projects.slice(0, 12).map((project) => (
          <div key={project.slug} className="group">
            <ProjectCard props={project} />
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentPosts({ posts }: { posts: Post[] }) {
  return (
    <div className="md:max-w-6xl max-w-prose mx-auto px-4">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-4xl md:text-5xl font-light italic tracking-tight text-foreground/90">
          Recently Published
        </h2>
        <div className="w-24 h-px bg-linear-to-r from-transparent via-primary to-transparent mx-auto mt-6" />
      </div>
      
      <div className="max-w-prose space-y-12">
        {posts.map((post) => (
          <article key={post.slug} className="group border-b border-border/30 pb-12 last:border-b-0">
            <header className="mb-6">
              <h3 className="scroll-m-20 border-b border-border pb-1 text-3xl font-semibold tracking-tight mb-3">
                <Link href={`/posts/${post.slug}`} className="hover:text-foreground/80 transition-all">
                  {post.title}
                </Link>
              </h3>
              <p className="text-lg text-muted-foreground italic leading-relaxed">
                {post.description}
              </p>
            </header>

            <div className="max-w-none text-muted-foreground mb-6">
              <MDXRemote source={post.excerpt} options={options} components={components}/>
            </div>

            <div className="flex justify-between items-center">
              <time className="text-sm text-muted-foreground" dateTime={post.date}>
                {format(new Date(post.date), 'PPP')}
              </time>
              <Button asChild variant="ghost" size="sm" className="group/btn">
                <Link href={`/posts/${post.slug}`}>
                  <span>Read More</span>
                  <svg className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}