import { getPlaiceholder } from 'plaiceholder';
import { notFound } from 'next/navigation';

import { convertParenthesesToComponent } from './utils';
import { GetPostMeta, Post } from '@/config/types';
import { getImage } from './minio';
import { sql } from './postgres';
import { siteConfig } from '@/config/site';

/**
 * Get all post files from the posts directory.
 */
export async function getPostSlugs(): Promise<string[]> {
  return sql<{ slug: string }[]>`
    SELECT slug FROM posts;
  `.then((values) => values.map((value) => value.slug));
}

export async function doesPostWithSlugExist(slug: string) {
  const result = await sql<{ slug: string }[]>`
    SELECT slug FROM posts WHERE slug = ${slug};
  `;
  return result.length > 0;
}

export async function getPost(slug: string) {
  const result = await sql`
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
  `;

  if (result.length === 0 || !result[0]) {
    notFound();
  }
  
  const post = result[0];
  const formattedContent = convertParenthesesToComponent(post.content);
  
  return {
    slug: slug,
    meta: {
      ...post,
      excerpt: convertParenthesesToComponent(post.excerpt),
      shortExcerpt: post.shortexcerpt && convertParenthesesToComponent(post.shortexcerpt),
      lastModified: post.lastmodified,
      coverSquare: post.coversquare,
    } as GetPostMeta,
    content: formattedContent,
  } as Post;
}

/**
 * @param image The image url in minio: "/images/catter-blog/cover.png"
 */
export async function getPlaceholder(image: string) {
  const imageStream = await getImage(image);
  const chunks: Uint8Array[] = [];

  for await (const chunk of imageStream) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);
  
  return getPlaiceholder(buffer);
}

/**
 * Get posts based on filters
 */
export async function getPosts({
  startInd = 0,
  endInd = 100000,
  tags = [],
  disallowTags = [],
}: {
  startInd?: number,
  endInd?: number,
  tags?: string[],
  disallowTags?: string[]
}) {
  if (!disallowTags.includes(siteConfig.invisible)) {
    disallowTags.push(siteConfig.invisible);
  }

  const postsWithTags = await sql`
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
        CASE WHEN ${tags.length} = 0 THEN true ELSE COUNT(DISTINCT pt.tag) FILTER (WHERE pt.tag = ANY(${tags})) > 0 END AS has_included_tag,
        CASE WHEN ${disallowTags.length} = 0 THEN false ELSE COUNT(DISTINCT pt.tag) FILTER (WHERE pt.tag = ANY(${disallowTags})) > 0 END AS has_disallowed_tag
      FROM 
        posts p
      LEFT JOIN 
        post_tags pt ON p.slug = pt.slug
      LEFT JOIN 
        post_keywords pk ON p.slug = pk.slug
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

  const posts: Post[] = postsWithTags.map(post => ({
    slug: post.slug,
    meta: {
      ...post,
      excerpt: convertParenthesesToComponent(post.excerpt),
      shortExcerpt: post.shortexcerpt && convertParenthesesToComponent(post.shortexcerpt),
      lastModified: post.lastmodified,
      coverSquare: post.coversquare,
    } as GetPostMeta,
    content: convertParenthesesToComponent(post.content),
  }));

  return posts;
}

/**
 * Get the number of posts for given filters
 */
export async function getPostsLength({ tags = [], disallowTags = [] }: { tags?: string[], disallowTags?: string[] }) {
  if (!disallowTags.includes(siteConfig.invisible)) {
    disallowTags.push(siteConfig.invisible);
  }
  
  const result = await sql`
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
  
  return Number(result[0].count);
}

/**
 * Get the number of projects
 */
export async function getProjectsLength() {
  const projectTags = ['project'];
  
  const result = await sql`
    WITH filtered_posts AS (
      SELECT 
        p.slug,
        COUNT(DISTINCT pt.tag) FILTER (WHERE pt.tag = ANY(${projectTags})) > 0 AS has_project_tag
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
    WHERE has_project_tag;
  `;
  
  return Number(result[0].count);
}

/**
 * Get list of all tags used across posts using an optimized query.
 */
export async function getListOfAllTags() {
  const result = await sql`
    SELECT DISTINCT tag
    FROM post_tags
    ORDER BY tag ASC;
  `;
  
  return result.map(row => row.tag);
}