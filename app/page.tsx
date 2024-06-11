import ListOfPosts from "@/app/ui/listOfPosts";
import { Suspense } from "react";
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

export default function Home() {
  return (
    <section className="max-w-prose mx-auto my-0 py-8 prose px-4 sm:px-8">
      <h1>
        Latest Posts
      </h1>
      <ListOfPosts lastNumOfPosts={5}/>
      <h1>
        Most Viewed Posts
      </h1>
      <Suspense>
        <MostViewedPosts postNum={5}/>
      </Suspense>
    </section>
  )
}

async function MostViewedPosts({ postNum }: { postNum: number }) {
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
        <div className="justify-between align-middle" key={post.slug}>
          <h2 className="prose-a:text-[#4c4f69] dark:prose-a:text-[#cdd6f4]">
            <Link
              href={'/posts/' + post.slug}
              passHref
              key={post.slug}
            >
              {post.meta.title}
            </Link>
          </h2>
          <em className="text-[#6c6f85] dark:text-[#a6adc8] not-prose">
            {`${post.meta.description} · ${post.count} views`}
          </em>
          <div>
            <MDXRemote source={post.meta.excerpt} options={options}/>
          </div>
        </div>
      ))}
    </div>
  );
}