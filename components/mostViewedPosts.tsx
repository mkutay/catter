import Link from 'next/link';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { unstable_cache } from 'next/cache';

import { Skeleton } from '@/components/ui/skeleton';
import { getViewsCount } from '@/lib/dataBaseQueries';
import { getPosts } from '@/lib/contentQueries';

const getCachedViewsCount = unstable_cache(
  async () => getViewsCount(),
  ['nextjs-blog-views-count'],
  {
    revalidate: 900, // 15 minutes = 900 seconds
  },
);

export async function MostViewedPosts({ postNum }: { postNum: number }) {
  const views = await getCachedViewsCount();
  const posts = getPosts({ });

  const postsWithViews = posts.map(post => {
    const viewsForSlug = views && views.find((view) => view.slug === post.slug);
    const number = viewsForSlug?.count || 0;

    return {
      slug: post.slug,
      meta: post.meta,
      content: post.content,
      views: number,
    }
  });

  postsWithViews.sort((a, b) => (
    b.views - a.views
  ));

  return (
    <ul className="px-0">
      {postsWithViews.slice(0, postNum).map((post) => (
        <li key={post.slug} className="group pl-0 hover:pl-2 transition-all px-0 my-0 flex flex-row items-baseline text-lg prose-a:text-foreground text-foreground">
          <div className="pr-4 group-hover:pr-2 transition-all">
            <ArrowRightIcon stroke="currentColor" strokeWidth="1.7px"/>
          </div>
          <div>
            <span className="pr-1 not-prose">
              <Link
                href={'/posts/' + post.slug}
                passHref
                key={post.slug}
                className="text-foreground underline font-semibold"
              >
                {post.meta.title}
              </Link>
            </span>
            <span className="px-2 text-2xl">
              ·
            </span>
            <span className="italic">
              {`${post.views} views`}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export async function MostViewedPostsFallback({ postNum }: { postNum: number }) {
  const posts: React.ReactNode[] = [];
  
  for (let i = 0; i < postNum; i++) {
    posts.push(
      <div key={i} className="flex flex-row items-center group pl-0 hover:pl-2 transition-all px-0">
        <div className="pr-4 group-hover:pr-2 transition-all">
          <ArrowRightIcon stroke="currentColor" strokeWidth="1.7px"/>
        </div>
        <Skeleton className="h-6 w-full my-2"/>
      </div>
    );
  }

  return (
    <ul className="px-0">
      {posts}
    </ul>
  );
}