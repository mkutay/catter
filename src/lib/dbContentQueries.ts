import { errAsync, fromPromise, okAsync } from 'neverthrow';
import { notFound } from 'next/navigation';
import matter from 'gray-matter';

import { Post } from '@/config/types';
import { sql } from './postgres';
import { siteConfig } from '@/config/site';

interface ContentError {
  message: string;
  code: "DATABASE_ERROR";
};

/**
 * Get all post files from the posts directory.
 */
export const getPostSlugs = () =>
  fromPromise(
    sql<{ slug: string }[]>`SELECT slug FROM posts;`,
    () => ({
      message: "Error fetching post slugs.",
      code: "DATABASE_ERROR",
    } as ContentError),
  )
  .map((values) => values.map((value) => value.slug));

export const doesPostWithSlugExist = (slug: string) => 
  fromPromise(
    sql<{ slug: string }[]>`SELECT slug FROM posts WHERE slug = ${slug};`,
    () => ({
      message: "Error checking if post exists.",
      code: "DATABASE_ERROR",
    } as ContentError),
  )
  .map((values) => values.length > 0);

// This function does not convert and parse content.
export const getPost = (slug: string) =>
  fromPromise(
    sql`
      SELECT
        p.*,
        ARRAY_AGG(DISTINCT pt.tag) AS tags,
        ARRAY_AGG(DISTINCT pk.keyword) AS keywords
      FROM
        posts p
      LEFT JOIN
        post_tags pt ON p.slug = pt.slug
      LEFT JOIN
        post_keywords pk ON p.slug = pk.slug
      WHERE
        p.slug = ${slug}
      GROUP BY
        p.slug
    `,
    () => ({
      message: "Error fetching post.",
      code: "DATABASE_ERROR",
    } as ContentError),
  )
  .andThrough((result) => {
    if (result.length === 0 || !result[0]) notFound();
    return okAsync(result);
  })
  .map((result) => result[0])
  // .andTee((post) => console.log(post))
  .andThen((post) => 
    post.content && post.title && post.description && post.date && post.locale && post.lastmodified && post.shortened && post.excerpt !== null
      ? okAsync(post)
      : errAsync({
          message: "Post is missing required fields.",
          code: "DATABASE_ERROR",
        } as ContentError)
  )
  .map((post) => ({
    ...post,
    shortExcerpt: post.shortexcerpt,
    lastModified: post.lastmodified,
    coverSquare: post.coversquare,
    tags: post.tags || [],
    keywords: post.keywords || [],
  } as Post));

/**
 * Get posts based on filters.
 * This function does not convert and parse content.
 */
export const getPosts = ({
  startInd = 0,
  endInd = 100000,
  tags = [],
  disallowTags = [],
}: {
  startInd?: number,
  endInd?: number,
  tags?: string[],
  disallowTags?: string[]
}) => {
  if (!disallowTags.includes(siteConfig.invisible)) {
    disallowTags.push(siteConfig.invisible);
  }

  const promise = sql`
    WITH filtered_posts AS (
      SELECT 
        p.slug,
        p.content,
        p.title,
        p.description,
        p.date,
        p.excerpt,
        p.locale,
        p.cover,
        p.coverSquare,
        p.lastModified,
        p.shortened,
        p.shortExcerpt,
        ARRAY_AGG(DISTINCT pt.tag) AS tags,
        ARRAY_AGG(DISTINCT pk.keyword) AS keywords,
        ARRAY_AGG(DISTINCT v.count) AS views,
        CASE WHEN ${tags.length} = 0 THEN true ELSE COUNT(DISTINCT pt.tag) FILTER (WHERE pt.tag = ANY(${tags})) > 0 END AS has_included_tag,
        CASE WHEN ${disallowTags.length} = 0 THEN false ELSE COUNT(DISTINCT pt.tag) FILTER (WHERE pt.tag = ANY(${disallowTags})) > 0 END AS has_disallowed_tag
      FROM 
        posts p
      LEFT JOIN 
        post_tags pt ON p.slug = pt.slug
      LEFT JOIN 
        post_keywords pk ON p.slug = pk.slug
      LEFT JOIN
        views v ON p.slug = v.slug
      GROUP BY 
        p.slug
    )
    SELECT *
    FROM filtered_posts
    WHERE 
      (${tags.length} = 0 OR has_included_tag) 
      AND NOT has_disallowed_tag
    ORDER BY 
      date DESC
    LIMIT ${endInd - startInd} 
    OFFSET ${startInd};
  `;

  return fromPromise(
    promise,
    (error) => ({
      message: "Error fetching posts. " + (error as Error).message,
      code: "DATABASE_ERROR",
    } as ContentError),
  )
  .map((postsWithTags) => postsWithTags.map((post) => ({
    ...post,
    shortExcerpt: post.shortexcerpt,
    lastModified: post.lastmodified,
    coverSquare: post.coversquare,
  } as Post)));
}

/**
 * Get the number of posts for given filters
 */
export const getPostsLength = ({ tags = [], disallowTags = [] }: { tags?: string[], disallowTags?: string[] }) => {
  if (!disallowTags.includes(siteConfig.invisible)) {
    disallowTags.push(siteConfig.invisible);
  }
  
  const promise = sql`
    WITH filtered_posts AS (
      SELECT 
        p.slug,
        COUNT(DISTINCT pt.tag) FILTER (WHERE pt.tag = ANY(${tags})) > 0 AS has_included_tag,
        COUNT(DISTINCT pt.tag) FILTER (WHERE pt.tag = ANY(${disallowTags})) > 0 AS has_disallowed_tag
      FROM 
        posts p
      LEFT JOIN 
        post_tags pt ON p.slug = pt.slug
      GROUP BY 
        p.slug
    )
    SELECT 
      COUNT(*) as count
    FROM filtered_posts
    WHERE 
      (${tags.length} = 0 OR has_included_tag) 
      AND NOT has_disallowed_tag;
  `;

  return fromPromise(
    promise,
    () => ({
      message: "Error fetching posts length.",
      code: "DATABASE_ERROR",
    } as ContentError),
  )
  .map((result) => Number(result[0].count));
}

/**
 * Get list of all tags used across posts using an optimized query.
 */
export const getListOfAllTags = () =>
  fromPromise(
    sql`
      SELECT DISTINCT tag
      FROM post_tags
      ORDER BY tag ASC;
    `,
    () => ({
      message: "Error fetching tags.",
      code: "DATABASE_ERROR",
    } as ContentError),
  )
  .map((result) => result.map((row) => row.tag as string));

export function createPost(content: string, slug: string): Post {
  const { data: frontmatter, content: contentWithoutFrontmatter } = matter(content);

  const getStringValue = (value: unknown, defaultValue: string): string => {
    return typeof value === 'string' ? value : defaultValue;
  };

  const getDateValue = (value: unknown, defaultValue: string) => {
    if (value instanceof Date) return value.toISOString();
    if (value) return new Date(value as string).toISOString();
    return defaultValue;
  };
  
  const getStringArray = (value: unknown): string[] => {
    return Array.isArray(value) ? value.filter(item => typeof item === 'string') as string[] : [];
  };
  
  slug = getStringValue(frontmatter.slug, slug);

  const post: Post = {
    slug,
    title: getStringValue(frontmatter.title, slug),
    content: contentWithoutFrontmatter,
    description: getStringValue(frontmatter.description, ""),
    date: getDateValue(frontmatter.date, new Date().toISOString()),
    excerpt: getStringValue(frontmatter.excerpt, ''),
    locale: getStringValue(frontmatter.locale, "en_UK"),
    cover: typeof frontmatter.cover === 'string' ? frontmatter.cover : null,
    coverSquare: typeof frontmatter.coverSquare === 'string' ? frontmatter.coverSquare : null,
    lastModified: getDateValue(frontmatter.lastModified, new Date().toISOString()),
    shortened: getStringValue(frontmatter.shortened, slug),
    shortExcerpt: getStringValue(frontmatter.shortExcerpt, ''),
    tags: getStringArray(frontmatter.tags),
    keywords: getStringArray(frontmatter.keywords)
  };
  
  return post;
}