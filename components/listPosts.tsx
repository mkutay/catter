import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";

import getPosts from "@/app/lib/getPosts";
import { options } from "@/app/lib/mdxRemoteSettings";

export default function ListPosts({ startInd, endInd, tag }: { startInd: number, endInd: number, tag?: string }) { // half-open interval
  const posts: {
    slug: string,
    meta: { [key: string]: any },
    content: string,
  }[] = getPosts({ startInd, endInd, tag });

  return (
    <div>
      {posts.map((post, index) => (
        <div key={post.slug} className="prose-h2:mt-0 prose-h2:mb-4">
          <h2 className="prose-a:text-[#4c4f69] dark:prose-a:text-[#cdd6f4]">
            <Link
              href={`/posts/${post.slug}`}
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
  );
}