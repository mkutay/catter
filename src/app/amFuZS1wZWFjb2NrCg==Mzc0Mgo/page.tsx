import { format } from "date-fns";
import { ResultAsync } from "neverthrow";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import Image from "next/image";
import Link from "next/link";

import { TypographyHr } from "@/components/typography/blockquote"
import { TypographyH3 } from "@/components/typography/headings"
import { ViewDisplay } from "@/components/viewDisplay";
import { components, options } from "@/config/mdxRemoteSettings";
import { getPost } from "@/lib/dbContentQueries";
import { getPlaceholder } from "@/lib/images";
import { Post } from "@/config/types";
import { Arg } from "@/components/arg";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "birinci asama ?!!",
  description: "Are you WORTHY enough to view this page? You are close yet so far away from the truth.",
  openGraph: {
    title: "birinci asama ?!!",
    description: "Are you WORTHY enough to view this page? You are close yet so far away from the truth.",
    images: ["/images/favicon.png"]
  },
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined> | undefined>
}) {
  const params = await searchParams;
  const key = params?.key === process.env.PEACOCK_KEY;

  const slugs = ['creating-a-clone-of-yourself', 'java-and-education', 'why-mathematics-is-lonely'];
  const posts = await ResultAsync.combine(slugs.map((slug) => getPost(slug)));
  if (posts.isErr()) throw new Error(posts.error.message);

  return (
    <main className="md:max-w-6xl max-w-prose mx-auto px-4 w-full my-6">
      <Arg hasKey={key} />
      <TypographyHr />
      <div className="mt-12">
        <TypographyH3>
          While you&apos;re here, might as well check my posts out! <span className="text-transparent absolute">
            The end is never the end is never the end
          </span>
        </TypographyH3>
        <div className="flex md:flex-row flex-col md:gap-6 gap-12 mt-8 md:max-w-6xl max-w-xl mx-auto md:mb-20 mb-16">
          {posts.value.map((post) => (
            <PostDisplay key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </main>
  )
}

async function PostDisplay({
  post,
}: {
  post: Post,
}) {
  const coverImage = post.cover;
  const placeholder = coverImage ? await getPlaceholder(coverImage) : null;
  const coverUrl = coverImage ? coverImage[0] === '/' ? coverImage : `/${coverImage}` : null;

  return (
    <div className="flex flex-col gap-2 md:w-1/3 w-full">
      <Link href={`/posts/${post.slug}`} className="flex flex-col group gap-2" prefetch={false}>
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
        <h2 className="lg:text-4xl/tight md:text-3xl text-3xl font-normal tracking-tighter text-stroke-medium text-stroke-background fix-text-stroke">
          <span className="lg:bg-[0%_93%] md:bg-[0%_90%] bg-[0%_89%] bg-gradient-to-r text-foreground from-foreground to-foreground lg:bg-[length:0%_3px] bg-[length:0%_2px] bg-no-repeat lg:group-hover:bg-[length:100%_3px] group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
            {post.title}
          </span>
        </h2>
      </Link>
      <div className="leading-normal">
        <MDXRemote source={post.shortExcerpt || post.excerpt} options={options} components={components} />
      </div>
      <div className="text-sm text-foreground tracking-tight font-light flex flex-row justify-between">
        <p>
          {format(post.date, 'PP')}
        </p>
        <ViewDisplay slug={post.slug} />
      </div>
    </div>
  );
}