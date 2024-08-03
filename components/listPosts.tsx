import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';

import { Button } from '@/components/ui/button';
import { getPosts } from '@/lib/contentQueries';
import { components, options } from '@/lib/mdxRemoteSettings';
import { postMeta } from '@/config/site';
import { turnTagString } from './tagsButtonGrid';

export default function ListPosts({
  startInd,
  endInd,
  tags,
  disallowTags
}: {
  startInd: number,
  endInd: number,
  tags?: string[],
  disallowTags?: string[]
}) { // half-open interval
  const posts: {
    slug: string,
    meta: postMeta,
    content: string,
  }[] = getPosts({ startInd, endInd, tags, disallowTags });

  return (
    <div className="flex flex-col gap-6">
      {posts.map((post, index) => (
        <div key={post.slug} className="flex flex-col gap-4">
          <h3 className="scroll-m-20 border-b border-border pb-1 text-3xl font-semibold tracking-tight first:mt-0 mt-6">
            <Link href={`/posts/${post.slug}`} className="hover:text-foreground/80 transition-all duration-100">
              {post.meta.title}
            </Link>
          </h3>
          <h4 className="text-description italic font-medium">
            {post.meta.description}
          </h4>
          <div className="prose">
            <MDXRemote source={post.meta.excerpt} options={options} components={components}/>
          </div>
          <div className="flex flex-row justify-end">
            <Button asChild variant="outline" size="default" className="w-fit">
              <Link href={`/posts/${post.slug}`}>
                {`Read More: ${post.meta.shortened.toLowerCase().split(' ').map(function(word) { return word[0].toUpperCase() + word.slice(1); }).join(' ')}`}
              </Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}