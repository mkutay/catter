import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';

import { postMeta } from '@/config/site';

export function getPostSlugs() {
  return fs.readdirSync(path.join(process.cwd(), 'content/posts'), 'utf-8')
    .map((filename) => 
      filename.replace('.mdx', '')
    );
}

export function getProps(pathTo: string, slug: string) {
  let markdownFile;

  try {
    markdownFile = fs.readFileSync(path.join(process.cwd(), path.join(pathTo, slug + '.mdx')), 'utf-8');
  } catch(error) {
    notFound();
  }

  const { data: meta, content } = matter(markdownFile);

  return {
    slug: slug,
    meta: meta as postMeta,
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

  const postSlugs = getPostSlugs();

  const posts: {
    slug: string,
    content: string,
    meta: postMeta,
  }[] = [];
  
  postSlugs.forEach((slug) => {
    const props = getProps('content/posts', slug);

    let disallowFlag: boolean = false;
    let allowFlag: boolean = false;

    props.meta.tags.forEach((tag) => {
      if (disallowTags.includes(tag)) {
        disallowFlag = true;
        return;
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