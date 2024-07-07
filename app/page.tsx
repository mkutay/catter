import { Suspense } from "react";
import { MostViewedPosts } from "@/app/ui/mostViewedPosts";
import getPosts from "@/app/lib/getPosts";
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import writeRss from "./lib/writeRss";
import EmailSubButton from "./ui/emailSubButton";

const options = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  }
};

export default function Home() {
  // writeRss();

  const posts: {
    slug: string,
    meta: { [key: string]: any }
  }[] = getPosts(0, 5);

  return (
    <section className="max-w-prose mx-auto my-0 py-8 prose px-4 prose-h1:my-0">
      <h1>
        Latest Posts
      </h1>
      <hr/>
      <div>
        {posts.map((post, index) => (
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
            {index !== posts.length - 1 && <hr/>}
          </div>
        ))}
      </div>
      <hr/>
      <EmailSubButton/>
      <hr/>
      <h1 className="mb-6">
        Top Posts
      </h1>
      <Suspense>
        <MostViewedPosts postNum={5}/>
      </Suspense>
    </section>
  )
}