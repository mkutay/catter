import type { Metadata } from "next";
import Link from "next/link";
import { TypographyH1 } from "@/components/typography/headings";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { getListOfAllTags } from "@/lib/dbContentQueries";
import { humanReadable } from "@/lib/utils";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: `List of Tags on the Posts`,
  description: `List and buttons of all the tags that posts have on ${siteConfig.name}.`,
  openGraph: {
    title: `List of Tags on the Posts`,
    description: `List and buttons of all the tags that posts have on ${siteConfig.name}.`,
    url: `${siteConfig.url}/tags`,
    images: ["images/favicon.png"],
  },
};

export default async function Page() {
  const tags = await getListOfAllTags();
  if (tags.isErr()) throw new Error(tags.error.message);
  return (
    <>
      <TypographyH1 className="mt-6 mb-8 text-primary">
        List of Tags on the Blog
      </TypographyH1>
      <div className="flex flex-col gap-6">
        <div className="gap-2 grid grid-flow-row sm:grid-cols-3 grid-cols-2 items-center">
          {tags.value.map((tag) => (
            <Button key={tag} variant="outline" asChild className="uppercase">
              <Link href={`/tags/${tag}`}>{humanReadable(tag)}</Link>
            </Button>
          ))}
        </div>
      </div>
    </>
  );
}
