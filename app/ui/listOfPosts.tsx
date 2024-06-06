import { parseISO, format } from 'date-fns';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';

const options = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  }
};

export default function ListOfPosts(params: { lastNumOfPosts: number }) {
  const { lastNumOfPosts } = params;

  const postFiles = fs.readdirSync(path.join(process.cwd(), 'app/posts/posts/'), 'utf-8');

  const posts = postFiles.map(filename => {
    const slug = filename.replace('.mdx', '');
    const source = fs.readFileSync(path.join(process.cwd(), `app/posts/posts/${slug}.mdx`), 'utf-8');
    let { data: frontMatter } = matter(source);

    const formattedDate = format(frontMatter.date, 'PP');

    frontMatter.date = formattedDate;

    return {
      meta: frontMatter,
      slug: slug,
    };
  });

  posts.sort((a, b) => (
    new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()
  ));

  const postsLength = posts.length;

  for (let i = 0; i < postsLength - lastNumOfPosts; i++) {
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
            {post.meta.description}
          </em>
          <div className="">
            <MDXRemote source={post.meta.excerpt} options={options}/>
          </div>
        </div>
      ))}
    </div>
  );
}
