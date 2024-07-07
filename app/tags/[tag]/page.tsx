import getPosts, { getPostsLength } from "@/app/lib/getPosts";
import { siteConfig } from "@/config/site";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from 'remark-gfm';

const options = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  }
};

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

export default function Page({ params }: { params: { tag: string } }) {
  const tag = params.tag;
  const posts = getPosts(0, 100000);
  let postsThatHaveTag: {
    slug: string,
    meta: { [key: string]: any }
  }[] = [];

  posts.forEach((post) => {
    if (post.meta.tags.includes(tag)) {
      postsThatHaveTag.push(post);
    }
  });

  return (
    <section className="max-w-prose mx-auto my-8 prose px-4 prose-h1:my-0">
      <h1>
        Tag: <span className="text-[#1e66f5] dark:text-[#89b4fa]">{tag}</span>
      </h1>
      <hr/>
      <div>
        {postsThatHaveTag.map((post, index) => (
          <div key={post.slug} className="prose-h2:mt-0 prose-h2:mb-4">
            <h2 className="prose-a:text-[#4c4f69] dark:prose-a:text-[#cdd6f4]">
              <Link
                href={'/posts/' + post.slug}
                passHref
                key={post.slug}
              >
                {post.meta.title}
              </Link>
            </h2>
            <em className="text-[#6c6f85] dark:text-[#a6adc8] not-prose my-4">
              {post.meta.description}
            </em>
            <div className="prose-p:my-4 prose-p:py-0">
              <MDXRemote source={post.meta.excerpt} options={options}/>
            </div>
            {index !== postsThatHaveTag.length - 1 && <hr/>}
          </div>
        ))}
      </div>
    </section>
  )
}

export async function generateStaticParams() {
  const posts = getPosts(0, 100000);
  let ret: { tag: string }[] = [];
  const tags = new Set<string>();

  posts.forEach((post) => {
    post.meta.tags.forEach((tag: string) => {
      tags.add(tag);
    });
  });

  const arrayTags: string[] = Array.from(tags);

  arrayTags.forEach((tag) => {
    ret.push({ tag: tag });
  })

  return ret;
}