import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';

export default function getProps(pathTo: string, slug: string) {
  let markdownFile;
  try {
    markdownFile = fs.readFileSync(path.join(process.cwd(), path.join(pathTo, slug + '.mdx')), 'utf-8');
  } catch(error) {
    notFound();
  }

  const { data: frontMatter, content } = matter(markdownFile);

  return {
    meta: frontMatter,
    slug: slug,
    content: content,
  };
}