import { siteConfig } from "@/config/site";
import TagsButtonGrid from "@/components/tagsButtonGrid";

export function generateMetadata({ params }: { params: { tag: string } }) {
  const tag = params.tag;

  return {
    title: `Tags On the Blog | Tag ${tag}`,
    description: `List of all the tags that posts have on Kutay's Blog, currently on displaying tag ${tag}.`,
    openGraph: {
      title: `Tags On the Blog | Tag ${tag}`,
      description: `List of all the tags that posts have on Kutay's Blog, currently on displaying tag ${tag}.`,
      url: `${siteConfig.url}/tags/${tag}`,
    },
  };
}

export default function Page() {
  return (
    <section className="max-w-prose mx-auto my-0 py-8 prose px-4 prose-h1:my-0">
      <h1>
        Tags
      </h1>
      <hr/>
      <TagsButtonGrid/>
    </section>
  )
}