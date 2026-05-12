import type { Metadata } from "next";
import TagsButtonGrid from "@/components/tagsButtonGrid";
import { TypographyH1 } from "@/components/typography/headings";
import { siteConfig } from "@/config/site";

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

export default function Page() {
  return (
    <>
      <TypographyH1 className="mt-6 mb-8 text-primary">
        List of Tags on the Blog
      </TypographyH1>
      <TagsButtonGrid />
    </>
  );
}
