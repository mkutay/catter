import { getViewsCount } from "@/app/lib/dataBaseQueries";
import path from "path";
import fs from "fs";
import matter from 'gray-matter';
import { parseISO, format } from 'date-fns';
import Link from "next/link";
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';

const options = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  }
};

export async function MostViewedPosts({ postNum }: { postNum: number }) {
  let views = await getViewsCount();

  const postFiles = fs.readdirSync(path.join(process.cwd(), 'app/posts/posts/'), 'utf-8');

  const posts = postFiles.map(filename => {
    const slug = filename.replace('.mdx', '');
    const source = fs.readFileSync(path.join(process.cwd(), `app/posts/posts/${slug}.mdx`), 'utf-8');
    let { data: frontMatter } = matter(source);

    const formattedDate = format(frontMatter.date, 'PP');

    frontMatter.date = formattedDate;

    const viewsForSlug = views && views.find((view) => view.slug === slug);
    const number = viewsForSlug?.count || 0

    return {
      meta: frontMatter,
      slug: slug,
      count: number,
    };
  });

  posts.sort((a, b) => (
    b.count - a.count
  ));

  const postsLength = posts.length;

  for (let i = 0; i < postsLength - postNum; i++) {
    posts.pop();
  }

  return (
    <div>
      {posts.map((post) => (
        <div key={post.slug} className="text-xl prose-a:text-[#4c4f69] dark:prose-a:text-[#cdd6f4] flex items-center text-[#4c4f69] dark:text-[#cdd6f4]">
          <div className="pr-2 text-2xl">
            ›
          </div>
          <Link
            href={'/posts/' + post.slug}
            passHref
            key={post.slug}
          >
            {post.meta.title}
          </Link>
          <div className="px-2 text-xl">
            ·
          </div>
          <em>
            {`${post.count} views`}
          </em>
        </div>
      ))}
    </div>
  );
}