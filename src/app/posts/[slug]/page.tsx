import path from "node:path";
import { format } from "date-fns";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { evaluate, MDXRemote } from "next-mdx-remote-client/rsc";
import readingTime from "reading-time";
import { Comments } from "@/components/comments/comments";
import { CopyShortened } from "@/components/copy-shortened";
import { DoublePane } from "@/components/double-pane";
import { SideTOC } from "@/components/side-toc";
import {
  ToggleParenthesesContextToggleButton,
  ToggleParenthesesProvider,
} from "@/components/toggle-parentheses";
import { TypographyH1 } from "@/components/typography/headings";
import { ViewDisplay } from "@/components/view-display";
import { components, options, type Scope } from "@/config/mdx-settings";
import { siteConfig } from "@/config/site";
import type { PostMeta } from "@/config/types";
import { getPost, getPostSlugs } from "@/lib/dbContentQueries";
import { getPlaceholder } from "@/lib/images";
import { humanReadable } from "@/lib/utils";

export const dynamic = "force-static";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPost(slug);
  if (result.isErr()) throw new Error(result.error.message);
  const props = result.value;

  const formattedDate = format(props.date, "PP");
  const coverImage = props.cover
    ? path.join("/api", props.cover)
    : "images/favicon.png";

  return {
    title: props.title,
    description: props.description,
    keywords: props.keywords ?? props.tags,
    openGraph: {
      title: props.title,
      description: props.description,
      url: `${siteConfig.url}/posts/${props.slug}`,
      locale: props.locale,
      type: "article",
      publishedTime: formattedDate,
      images: [coverImage],
      siteName: siteConfig.name,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const props = await getPost(slug).match(
    (p) => p,
    (err) => {
      throw new Error(err.message);
    },
  );

  const formattedDate = format(props.date, "PP");
  const time = readingTime(props.content);

  const { content, scope, error } = await evaluate<PostMeta, Scope>({
    source: props.content,
    options,
    components,
  });

  if (error) throw new Error(error.message);

  const coverImage = props.cover;
  const placeholder = coverImage ? await getPlaceholder(coverImage) : null;
  const coverUrl = coverImage
    ? coverImage[0] === "/"
      ? coverImage
      : `/${coverImage}`
    : null;

  return (
    <ToggleParenthesesProvider defaultOpen={true}>
      <div className="bg-primary w-full h-fit py-6 lg:space-y-14 space-y-10">
        <div className="lg:max-w-6xl max-w-prose mx-auto px-4 space-y-2">
          <p className="text-lg font-semibold text-primary-foreground">
            {formattedDate}
          </p>
          <div className="flex flex-row gap-4">
            {props.tags.map((tag: string) => (
              <p
                key={tag}
                className="text-primary-foreground uppercase font-mono text-sm underline hover:opacity-80 transition-opacity"
              >
                <Link href={`/tags/${tag}`}>{humanReadable(tag)}</Link>
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
            <MDXRemote
              source={props.description}
              components={components}
              options={options}
            />
          </div>
        </div>
      </div>

      {/* Main content layout with a sticky sidebar for TOC */}
      <DoublePane
        side={
          <div className="sticky top-20 mt-8 hidden h-full flex-col flex-1 lg:flex pr-4">
            <SideTOC toc={scope.toc ?? []} />
          </div>
        }
        sideGap="gap-4"
      >
        <div>
          {coverImage && placeholder && (
            <div className="my-6">
              <Image
                alt={`${props.title} post cover image`}
                src={`/api${coverUrl}`}
                className="lg:rounded-md rounded-sm lg:shadow-md shadow-xs"
                width={placeholder.metadata.width}
                height={placeholder.metadata.height}
                priority={true}
                placeholder={placeholder.base64 as `data:image/${string}`}
              />
            </div>
          )}
          <div className="my-4 flex flex-row items-center gap-4 justify-between">
            <ToggleParenthesesContextToggleButton />
            <div className="flex flex-row items-center gap-4 justify-end">
              <div className="tracking-tight font-light text-base">
                <ViewDisplay slug={props.slug} increment />
              </div>
              <CopyShortened shortened={props.shortened} />
            </div>
          </div>
        </div>
        <main>{content}</main>
        <Comments slug={props.slug} />
      </DoublePane>
    </ToggleParenthesesProvider>
  );
}

/**
 * Generates static paths for all posts at build time.
 */
export async function generateStaticParams() {
  return await getPostSlugs().match(
    (posts) =>
      posts.map((slug) => ({
        slug,
      })),
    () => [],
  );
}
