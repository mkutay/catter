import getPosts, { getPostsLength } from "@/app/lib/getPosts";
import Link from 'next/link';
import { siteConfig } from "@/config/site";

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
  const posts = getPosts(0, 100000);
  const tags = new Set<string>();

  posts.forEach((post) => {
    post.meta.tags.forEach((tag: string) => {
      tags.add(tag);
    });
  });

  const arrayTags: string[] = Array.from(tags);

  return (
    <section className="max-w-prose mx-auto my-0 py-8 prose px-4 prose-h1:my-0">
      <h1>
        Tags
      </h1>
      <hr/>
      <ul className="text-lg">
        {arrayTags.map((tag) => (
          <li key={tag}>
            <Link href={`/tags/${tag}`}>
              {tag}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}