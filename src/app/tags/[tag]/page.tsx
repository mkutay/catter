import type { Metadata } from "next";
import { ListPosts } from "@/components/list-posts";
import { TypographyH1 } from "@/components/typography/headings";
import { siteConfig } from "@/config/site";
import { getListOfAllTags } from "@/lib/content-queries";
import { humanReadable } from "@/lib/utils";

export async function generateMetadata(props: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  "use cache";
  const params = await props.params;
  const { tag } = params;

  return {
    title: `Posts With Tag: ${tag}`,
    description: `List of all the tags that posts have on ${siteConfig.name}, currently displaying tag ${tag}.`,
    openGraph: {
      title: `Posts With Tag: ${tag}`,
      description: `List of all the tags that posts have on ${siteConfig.name}, currently displaying tag ${tag}.`,
      url: `${siteConfig.url}/tags/${tag}`,
    },
  };
}

export default async function Page(props: {
  params: Promise<{ tag: string }>;
}) {
  "use cache";
  const params = await props.params;
  const tag = params.tag;
  return (
    <>
      <TypographyH1 className="mt-6 mb-8 text-primary">
        Posts With Tag:{" "}
        <span className="font-light not-italic text-foreground uppercase">
          {humanReadable(tag)}
        </span>
      </TypographyH1>
      <ListPosts tags={[tag]} />
    </>
  );
}

export async function generateStaticParams() {
  const result = await getListOfAllTags();
  if (result.isErr()) throw new Error(result.error.message);
  return result.value.map((tag) => ({ tag }));
}
