import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { unstable_cache } from 'next/cache';

import { getViewsCount } from '@/lib/dataBaseQueries';
import { getProps } from '@/lib/contentQueries';

const getCachedViewsCount = unstable_cache(
  async (postNum: number) => getViewsCount(postNum),
  ['nextjs-blog-views-count'],
  {
    revalidate: 900, // 15 minutes = 900 seconds
  },
);

export async function MostViewedPosts({ postNum }: { postNum: number }) {
  const views = await getCachedViewsCount(postNum);
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
            <ArrowRightIcon stroke="currentColor" strokeWidth="1.8px" width="18px" height="18px"/>
          </div>
          <h3 className="scroll-m-20 text-xl font-medium tracking-tight">
            <Link
              href={'/posts/' + post.slug}
              passHref
              key={post.slug}
              className="text-foreground underline font-semibold"
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
      <Skeleton className="w-full h-7"/>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {posts}
    </ul>
  );
}