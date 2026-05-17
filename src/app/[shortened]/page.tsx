import path from "node:path";
import { format } from "date-fns";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { siteConfig } from "@/config/site";
import { getPosts } from "@/lib/content-queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ shortened: string }>;
}): Promise<Metadata> {
  "use cache";
  const { shortened } = await params;
  const posts = await getPosts({});
  if (posts.isErr()) throw new Error(posts.error.message);

  const props = posts.value.find((post) => post.shortened === shortened);
  if (!props) notFound();

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
  params: Promise<{ shortened: string }>;
}) {
  "use cache";
  const { shortened } = await params;
  const posts = await getPosts({});
  if (posts.isErr()) throw new Error(posts.error.message);

  posts.value.forEach((post) => {
    if (post.shortened === shortened) {
      redirect(`/posts/${post.slug}`);
    }
  });
}

export async function generateStaticParams() {
  const ret: { shortened: string }[] = [];
  const posts = await getPosts({});
  if (posts.isErr()) throw new Error(posts.error.message);

  posts.value.forEach((post) => {
    ret.push({ shortened: post.shortened });
  });

  return ret;
}
