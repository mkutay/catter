import { getViewsCount } from "@/app/lib/dataBaseQueries";
import path from "path";
import fs from "fs";
import matter from 'gray-matter';
import { parseISO, format } from 'date-fns';
import Link from "next/link";
import remarkGfm from 'remark-gfm';
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

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
    <ul className="px-0">
      {posts.map((post) => (
        <li key={post.slug} className="px-0 my-0 flex place-items-baseline text-lg prose-a:text-[#4c4f69] dark:prose-a:text-[#cdd6f4] text-[#4c4f69] dark:text-[#cdd6f4]">
          <div className={`pr-2 text-2xl font-bold ${inter.className}`}>
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
            {`${post.count} views`}
          </span>
          </div>
        </li>
      ))}
    </ul>
  );
}