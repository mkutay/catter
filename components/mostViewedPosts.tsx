import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRightIcon } from '@radix-ui/react-icons';

import { getViewsCount } from '@/lib/dataBaseQueries';
import { getPosts } from '@/lib/postQueries';

export async function MostViewedPosts({ postNum }: { postNum: number }) {
  const views = await getViewsCount();
  const posts = getPosts({  });

  let postsWithViews = posts.map(post => {
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

  postsWithViews = postsWithViews.slice(0, postNum);

  return (
    <ul className="px-0">
      {postsWithViews.map((post) => (
        <li key={post.slug} className="group pl-0 hover:pl-2 transition-all px-0 my-0 flex flex-row items-baseline text-lg prose-a:text-[#4c4f69] dark:prose-a:text-[#cdd6f4] text-[#4c4f69] dark:text-[#cdd6f4]">
          <div className="pr-4 group-hover:pr-2 transition-all">
            <ArrowRightIcon stroke="currentColor" strokeWidth="1.7px"/>
          </div>
          <div>
            <span className="pr-1">
              <Link
                href={'/posts/' + post.slug}
                passHref
                key={post.slug}
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
  const posts = [];
  for (let i = 0; i < postNum; i++) {
    posts.push(i);
  }

  return (
    <ul className="px-0">
      {posts.map((ind) => (
        <div key={ind} className="flex flex-row items-center group pl-0 hover:pl-2 transition-all px-0">
          <div className="pr-4 group-hover:pr-2 transition-all">
            <ArrowRightIcon stroke="currentColor" strokeWidth="1.7px"/>
          </div>
          <Skeleton className="h-6 w-full my-2"/>
        </div>
      ))}
    </ul>
  );
}