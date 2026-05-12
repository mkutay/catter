import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote-client/rsc";

import { Button } from "@/components/ui/button";
import { components, options } from "@/config/mdxRemoteSettings";
import { getPosts } from "@/lib/dbContentQueries";
import { postShortened } from "@/lib/utils";

export default async function ListPosts({
  tags,
  disallowTags,
}: {
  tags?: string[];
  disallowTags?: string[];
}) {
  // half-open interval
  const result = await getPosts({ tags, disallowTags });
  if (result.isErr()) throw new Error(result.error.message);
  const posts = result.value;

  if (posts.length === 0) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      {posts.map((post) => (
        <div key={post.slug} className="flex flex-col gap-4">
          <h2 className="scroll-m-20 border-b border-border pb-1 text-3xl font-semibold tracking-tight first:mt-0 mt-6">
            <Link
              href={`/posts/${post.slug}`}
              className="hover:text-foreground/80 transition-all"
            >
              {post.title}
            </Link>
          </h2>
          <h3 className="text-muted-foreground italic font-medium">
            {post.description}
          </h3>
          <div>
            <MDXRemote
              source={post.excerpt}
              options={options}
              components={components}
            />
          </div>
          <div className="flex flex-row justify-end">
            <Button
              asChild
              variant="outline"
              size="default"
              className="w-fit uppercase"
            >
              <Link href={`/posts/${post.slug}`}>
                {`Read More: ${postShortened(post.shortened)}`}
              </Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
