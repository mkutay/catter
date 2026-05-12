import type { Metadata } from "next";
import DoublePane from "@/components/doublePane";
import ListPosts from "@/components/listPosts";
import { TypographyH1 } from "@/components/typography/headings";
import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: `Posts and Tags On the Blog`,
  description: `List of all the latest posts and tags on ${siteConfig.name}.`,
  openGraph: {
    title: `Posts`,
    description: `List of all the latest posts on ${siteConfig.name}.`,
    url: `${siteConfig.url}/posts`,
  },
};

export default function Page() {
  return (
    <DoublePane>
      <TypographyH1 className="mt-6 mb-8 text-primary">
        List of All Posts
      </TypographyH1>
      <ListPosts disallowTags={["project"]} />
    </DoublePane>
  );
}
