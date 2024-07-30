import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';

import { getPosts } from '@/lib/postQueries';
import { components, options } from '@/lib/mdxRemoteSettings';
import { Button } from '@/components/ui/button';
import { postMeta } from '@/config/site';

export default function ListPosts({ startInd, endInd, tag }: { startInd: number, endInd: number, tag?: string }) { // half-open interval
  const posts: {
    slug: string,
    meta: postMeta,
    content: string,
  }[] = getPosts({ startInd, endInd, tag });

  return (
    <div className="flex flex-col divide-y divide-muted">
      {posts.map((post, index) => (
        <div key={post.slug} className="prose-h2:my-0 flex flex-col gap-4 py-8 first:pt-0">
          <h2 className="font-normal tracking-tight">
            {post.meta.title}
          </h2>
          <em className="text-description not-prose">
            {post.meta.description}
          </em>
          <div className="prose-p:my-0">
            <MDXRemote source={post.meta.excerpt} options={options} components={components}/>
          </div>
          <div className="not-prose flex flex-row justify-end">
            <Button asChild variant="outline" size="md" className="w-fit">
              <Link href={`/posts/${post.slug}`}>
                Read More
              </Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}