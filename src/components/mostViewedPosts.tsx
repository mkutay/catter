import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { Skeleton } from '@/components/ui/skeleton';
import { getViewsCount } from '@/lib/database-queries/views';
import { getProps } from '@/lib/contentQueries';

export async function MostViewedPosts({ postNum }: { postNum: number }) {
  const viewsResult = await getViewsCount({ postNum });

  if (viewsResult.isErr()) {
    console.error("Error in getting the view count in MostViewedPosts:", viewsResult.error.message);
    return (
      <p className="font-normal leading-7 [&:not(:first-child)]:mt-6 text-destructive">
        Sorry. Could not fetch the most viewed posts.
      </p>
    );
  }

  const views = viewsResult.value;

  const posts = views.map(view => {
    const props = getProps('content/posts', view.slug);
    
    return {
      slug: props.slug,
      meta: props.meta,
      content: props.content,
      views: view.count,
    };
  });

  return (
    <ul className="flex flex-col gap-2">
      {posts.slice(0, postNum).map((post) => (
        <li key={post.slug} className="group pl-0 hover:pl-2 transition-all animate-in flex flex-row items-start">
          <div className="pr-4 group-hover:pr-2 transition-all animate-in mt-1.5">
            <ArrowRight stroke="currentColor" strokeWidth="2.4px" width="18px" height="18px" />
          </div>
          <h3 className="scroll-m-20 text-xl font-normal tracking-tight">
            <Link
              href={'/posts/' + post.slug}
              passHref
              key={post.slug}
              prefetch={false}
              className="text-foreground"
            >
              {post.meta.title}
            </Link>
          </h3>
        </li>
      ))}
    </ul>
  );
}

export async function MostViewedPostsFallback({ postNum }: { postNum: number }) {
  const posts: React.ReactNode[] = [];
  
  for (let i = 0; i < postNum; i++) {
    posts.push(
      <Skeleton key={i} className="w-full h-6"/>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {posts}
    </ul>
  );
}