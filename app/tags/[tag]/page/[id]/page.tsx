import getPosts, { getPostsLength } from "@/app/lib/getPosts";
import { siteConfig } from "@/config/site";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from 'remark-gfm';
import PaginationArrows from "@/components/paginationArrows";
import { notFound } from "next/navigation";

const options = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  }
};

export function generateMetadata({ params }: { params: { tag: string } }) {
  const tag = params.tag;

  return {
    title: `Tags On the Blog | Tag: ${tag}`,
    description: `List of all the tags that posts have on Kutay's Blog, currently on displaying tag ${tag}.`,
    openGraph: {
      title: `Tags On the Blog | Tag ${tag}`,
      description: `List of all the tags that posts have on Kutay's Blog, currently on displaying tag ${tag}.`,
      url: `${siteConfig.url}/tags/${tag}`,
    },
  };
}

export default function Page({ params }: { params: { tag: string, id: string } }) {
  const id: number = Number(params.id);
  const tag = params.tag;
  
  if (/^-?\d+$/.test(params.id) == false) {
    notFound();
  }

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

  if (siteConfig.postNumPerPage * (id - 1) >= postsThatHaveTag.length || id <= 0) {
    notFound();
  }

  const postsTagSliced = postsThatHaveTag.slice(siteConfig.postNumPerPage * (id - 1), siteConfig.postNumPerPage * id);

  return (
    <section className="max-w-prose mx-auto my-8 prose px-4 prose-h1:my-0">
      <h1>
        Posts With Tag: <span className="text-[#1e66f5] dark:text-[#89b4fa]">{tag.charAt(0).toUpperCase() + tag.slice(1)}</span>
      </h1>
      <hr/>
      <div>
        {postsTagSliced.map((post, index) => (
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
            {index !== postsTagSliced.length - 1 && <hr/>}
          </div>
        ))}
      </div>
      <hr/>
      <PaginationArrows totalPages={Math.ceil(postsThatHaveTag.length / siteConfig.postNumPerPage)} currentId={id} href={`/tags/${tag}/page`}/>
    </section>
  )
}

export async function generateStaticParams() {
  const posts = getPosts(0, 100000);
  let ret: { tag: string, id: string }[] = [];
  const tags = new Set<string>();
  const tagsMap: { [key: string]: any } = {};

  posts.forEach((post) => {
    post.meta.tags.forEach((tag: string) => {
      tags.add(tag);
      tagsMap[tag] = 0;
    });
  });

  posts.forEach((post) => {
    post.meta.tags.forEach((tag: string) => {
      tagsMap[tag] += 1;
    });
  });

  const arrayTags: string[] = Array.from(tags);

  arrayTags.forEach((tag) => {
    const tagsMapLength = tagsMap[tag];
    for (let i = 1; i <= Math.ceil(tagsMapLength / siteConfig.postNumPerPage); i++) {
      ret.push({ tag: tag, id: i.toString() });
    }
  })

  return ret;
}