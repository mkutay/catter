import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';

import { postMeta } from '@/config/site';

export function getPostFiles() {
  const postFiles = fs.readdirSync(path.join(process.cwd(), 'content/posts'), 'utf-8');
  return postFiles;
}

export function getProps(pathTo: string, slug: string) {
  let markdownFile;

  try {
    markdownFile = fs.readFileSync(path.join(process.cwd(), path.join(pathTo, slug + '.mdx')), 'utf-8');
  } catch(error) {
    notFound();
  }

  const { data: frontMatter, content } = matter(markdownFile);

  return {
    slug: slug,
    meta: frontMatter as postMeta,
    content: content,
  };
}

export function getPosts({
  startInd,
  endInd,
  tags,
  disallowTags,
}: {
  startInd?: number,
  endInd?: number,
  tags?: string[],
  disallowTags?: string[]
}) { // half-open interval, ie. [startInd, endInd)
  startInd = startInd ?? 0;
  endInd = endInd ?? 100000;
  disallowTags = disallowTags ?? [];
  tags = tags ?? [];

  const postFiles = getPostFiles();

  let posts: {
    slug: string,
    content: string,
    meta: postMeta,
  }[] = [];
  
  postFiles.forEach((filename) => {
    const slug = filename.replace('.mdx', '');
    const props = getProps('content/posts', slug);
    let disallowFlag: boolean = false;
    let allowFlag: boolean = false;

    props.meta.tags.forEach((tag) => {
      if (disallowTags.includes(tag)) {
        disallowFlag = true;
      }
      if (tags.includes(tag)) {
        allowFlag = true;
      }
    });

    if (disallowFlag) return;
    if (tags.length == 0 || allowFlag) {
      posts.push(props);
    }
  });

  posts.sort((a, b) => (
    new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()
  ));

  return posts.slice(startInd, endInd);
}

export function getPostsLength({ tags, disallowTags }: { tags?: string[], disallowTags?: string[] }) {
  return getPosts({ tags, disallowTags }).length;
}

export function getProjectsLength() {
  return getPosts({ tags: ['project'] }).length;
}

export function getListOfAllTags() {
  const posts = getPosts({ });
  const tags = new Set<string>();

  posts.forEach((post) => {
    post.meta.tags.forEach((tag: string) => {
      tags.add(tag);
    });
  });

  return Array.from(tags);
}