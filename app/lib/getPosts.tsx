import { parseISO, format } from 'date-fns';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

export default function getPosts(startInd: number, endInd: number) { // half-open interval, ie. [startInd, endInd)
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

  return posts.slice(startInd, endInd);
}

export function getPostsLength() {
  return getPosts(0, 100000).length;
}