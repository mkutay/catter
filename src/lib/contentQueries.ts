import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';

import { PostData, PostMeta } from '@/config/types';
import { convertParenthesesToComponent } from './parentheses';

/**
 * Get all post files from the posts directory.
 */
export function getPostFiles(): string[] {
  return fs.readdirSync(path.join(process.cwd(), 'content/posts'), 'utf-8');
}

export function doesPostWithSlugExist(slug: string): boolean {
  return getPostFiles().includes(slug + '.mdx');
}

export function getPostProps(slug: string): PostData {
  return getProps('content/posts', slug);
}

export function getAboutProps() {
  let markdownFile;
  try {
    markdownFile = fs.readFileSync(path.join(process.cwd(), path.join('content/pages/about.mdx')), 'utf-8');
  } catch (error) {
    console.log(error);
    notFound();
  }

  const { data: frontMatter, content } = matter(markdownFile);

  const formattedContent = convertParenthesesToComponent(content);
  
  const postData = {
    meta: frontMatter as {
      title: string,
      description: string,
      date: string,
    },
    content: formattedContent,
  };
  
  return postData;
}

/**
 * Get properties for a specific slug in a path (post or page).
 */
export function getProps(pathTo: string, slug: string): PostData {
  let markdownFile;
  try {
    markdownFile = fs.readFileSync(path.join(process.cwd(), path.join(pathTo, slug + '.mdx')), 'utf-8');
  } catch (error) {
    console.log(error);
    notFound();
  }

  const { data: frontMatter, content } = matter(markdownFile);
  const fm = frontMatter as PostMeta;

  const formattedContent = convertParenthesesToComponent(content);
  
  const postData = {
    slug: slug,
    meta: {
      ...fm,
      excerpt: convertParenthesesToComponent(fm.excerpt),
      shortExcerpt: fm.shortExcerpt && convertParenthesesToComponent(fm.shortExcerpt),
    } as PostMeta,
    content: formattedContent,
  };
  
  return postData;
}

/**
 * Get posts based on filters.
 */
export function getPosts({
  startInd = 0,
  endInd = 100000,
  tags = [],
  disallowTags = [],
}: {
  startInd?: number,
  endInd?: number,
  tags?: string[],
  disallowTags?: string[]
}): PostData[] {
  const postFiles = getPostFiles();
  const posts: PostData[] = [];
  
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

/**
 * Get the number of posts for given filters (possible none).
 */
export function getPostsLength({ tags, disallowTags }: { tags?: string[], disallowTags?: string[] }): number {
  return getPosts({ tags, disallowTags }).length;
}

/**
 * Get the number of projects.
 */
export function getProjectsLength(): number {
  return getPosts({ tags: ['project'] }).length;
}

/**
 * Get list of all tags used across posts.
 */
export function getListOfAllTags(): string[] {
  const posts = getPosts({});
  const tags = new Set<string>();

  posts.forEach((post) => {
    post.meta.tags.forEach((tag: string) => {
      tags.add(tag);
    });
  });

  return Array.from(tags);
}