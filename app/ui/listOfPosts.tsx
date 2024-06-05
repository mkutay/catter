import { parseISO, format } from 'date-fns';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import Link from 'next/link';

export default function ListOfPosts() {
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

  return (
    <div>
      {posts.map((post) => (
        <div className="flex justify-between align-middle" key={post.slug}>
          <div>
            <h3 className="prose-a:text-[#4c4f69] dark:prose-a:text-[#cdd6f4]">
              <Link
                href={'/posts/' + post.slug}
                passHref
                key={post.slug}
              >
                {post.meta.title}
              </Link>
            </h3>
            <p>{post.meta.description}</p>
          </div>
          <div className="flex">
            <p>{post.meta.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
