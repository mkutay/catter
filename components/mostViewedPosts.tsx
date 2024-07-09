import Link from "next/link";

import { getViewsCount } from "@/app/lib/dataBaseQueries";
import getPosts from "@/app/lib/getPosts";

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
        <li key={post.slug} className="px-0 my-0 flex place-items-baseline text-lg prose-a:text-[#4c4f69] dark:prose-a:text-[#cdd6f4] text-[#4c4f69] dark:text-[#cdd6f4]">
          <div className={`pr-2 text-2xl font-bold`}>
            ⇒
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
            <span className="px-2 text-xl">
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