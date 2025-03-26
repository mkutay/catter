import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

import { type PostData, PostMeta } from '@/config/types';

let postFilesCache: string[] | null = null;
const postsCache: Map<string, PostData> = new Map();
const filteredPostsCache: Map<string, PostData[]> = new Map();
let tagsCache: string[] | null = null;

/**
 * Get all post files from the posts directory.
 */
export function getPostFiles(): string[] {
  if (!postFilesCache) {
    postFilesCache = fs.readdirSync(path.join(process.cwd(), 'content/posts'), 'utf-8');
  }
  return postFilesCache;
}

/**
 * Get post properties for a specific slug.
 */
export function getProps(pathTo: string, slug: string): PostData {
  const cacheKey = `${pathTo}/${slug}`;
  
  if (postsCache.has(cacheKey)) {
    return postsCache.get(cacheKey)!;
  }
  
  let markdownFile;
  try {
    markdownFile = fs.readFileSync(path.join(process.cwd(), path.join(pathTo, slug + '.mdx')), 'utf-8');
  } catch(error) {
    throw new Error(`Post ${slug} not found.`);
  }

  const { data: frontMatter, content } = matter(markdownFile);
  
  const postData = {
    slug: slug,
    meta: frontMatter as PostMeta,
    content: content,
  };
  
  postsCache.set(cacheKey, postData);
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
  // Create a cache key based on the filter parameters
  const cacheKey = `${startInd}-${endInd}-${tags.join(',')}-${disallowTags.join(',')}`;
  
  if (filteredPostsCache.has(cacheKey)) {
    return filteredPostsCache.get(cacheKey)!;
  }
  
  const postFiles = getPostFiles();
  let posts: PostData[] = [];
  
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

  const result = posts.slice(startInd, endInd);
  filteredPostsCache.set(cacheKey, result);
  return result;
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
  if (tagsCache) {
    return tagsCache;
  }
  
  const posts = getPosts({});
  const tags = new Set<string>();

  posts.forEach((post) => {
    post.meta.tags.forEach((tag: string) => {
      tags.add(tag);
    });
  });

  tagsCache = Array.from(tags);
  return tagsCache;
}

/**
 * Helper to clear all caches to refresh data.
 */
export function refreshContentCache(): void {
  postFilesCache = null;
  postsCache.clear();
  filteredPostsCache.clear();
  tagsCache = null;
}