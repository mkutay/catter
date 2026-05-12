import type { Metadata } from "next";
import DoublePane from "@/components/doublePane";
import ListPosts from "@/components/listPosts";
import { TypographyH1 } from "@/components/typography/headings";
import { siteConfig } from "@/config/site";
import { getPostsLength } from "@/lib/dbContentQueries";

export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Posts and Tags On the Blog`,
    description: `List of all the latest posts and tags on ${siteConfig.name}.`,
    openGraph: {
      title: `Posts`,
      description: `List of all the latest posts on ${siteConfig.name}.`,
      url: `${siteConfig.url}/posts`,
    },
  };
}

export default async function Page() {
  const result = await getPostsLength({ disallowTags: ["project"] });
  if (result.isErr()) throw new Error(result.error.message);
  const postsLength = result.value;

  return (
    <DoublePane>
      <TypographyH1 className="mt-6 mb-8 text-primary">
        List of All Posts
      </TypographyH1>
      <ListPosts startInd={0} endInd={postsLength} disallowTags={["project"]} />
    </DoublePane>
  );
}
