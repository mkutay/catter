import { and, asc, desc, eq, getTableColumns, not, sql } from "drizzle-orm";
import matter from "gray-matter";
import { errAsync, fromPromise, okAsync } from "neverthrow";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import type { Post } from "@/config/types";
import { db } from "./db/drizzle";
import { postKeywords, posts, postTags, views } from "./db/schema";

interface ContentError {
  message: string;
  code: "DATABASE_ERROR";
}

/**
 * Get all post files from the posts directory.
 */
export const getPostSlugs = () =>
  fromPromise(
    db.select({ slug: posts.slug }).from(posts),
    () =>
      ({
        message: "Error fetching post slugs.",
        code: "DATABASE_ERROR",
      }) as ContentError,
  ).map((values) => values.map((value) => value.slug));

export const doesPostWithSlugExist = (slug: string) =>
  fromPromise(
    db.select({ slug: posts.slug }).from(posts).where(eq(posts.slug, slug)),
    () =>
      ({
        message: "Error checking if post exists.",
        code: "DATABASE_ERROR",
      }) as ContentError,
  ).map((values) => values.length > 0);

// This function does not convert and parse content.
export const getPost = (slug: string) =>
  fromPromise(
    db
      .select({
        ...getTableColumns(posts),
        tags: sql<
          string[]
        >`ARRAY_REMOVE(ARRAY_AGG(DISTINCT ${postTags.tag}), NULL)`,
        keywords: sql<
          string[]
        >`ARRAY_REMOVE(ARRAY_AGG(DISTINCT ${postKeywords.keyword}), NULL)`,
      })
      .from(posts)
      .leftJoin(postTags, eq(posts.slug, postTags.slug))
      .leftJoin(postKeywords, eq(posts.slug, postKeywords.slug))
      .where(eq(posts.slug, slug))
      .groupBy(posts.slug),
    () =>
      ({
        message: "Error fetching post.",
        code: "DATABASE_ERROR",
      }) as ContentError,
  )
    .andThrough((result) => {
      if (result.length === 0 || !result[0]) notFound();
      return okAsync(result);
    })
    .map((result) => result[0])
    // .andTee((post) => console.log(post))
    .andThen((post) =>
      post.content &&
      post.title &&
      post.description &&
      post.date &&
      post.locale &&
      post.lastmodified &&
      post.shortened &&
      post.excerpt !== null
        ? okAsync(post)
        : errAsync({
            message: "Post is missing required fields.",
            code: "DATABASE_ERROR",
          } as ContentError),
    )
    .map(
      (post) =>
        ({
          ...post,
          shortExcerpt: post.shortexcerpt,
          lastModified: post.lastmodified,
          coverSquare: post.coversquare,
          tags: post.tags || [],
          keywords: post.keywords || [],
        }) as Post,
    );

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
  startInd?: number;
  endInd?: number;
  tags?: string[];
  disallowTags?: string[];
}) => {
  if (!disallowTags.includes(siteConfig.invisible)) {
    disallowTags.push(siteConfig.invisible);
  }

  const hasIncludedTagSql =
    tags.length === 0
      ? sql<boolean>`true`
      : sql<boolean>`COUNT(DISTINCT ${postTags.tag}) FILTER (WHERE ${postTags.tag} = ANY(ARRAY[${sql.join(
          tags.map((t) => sql`${t}`),
          sql`, `,
        )}]::text[])) > 0`;

  const hasDisallowedTagSql =
    disallowTags.length === 0
      ? sql<boolean>`false`
      : sql<boolean>`COUNT(DISTINCT ${postTags.tag}) FILTER (WHERE ${postTags.tag} = ANY(ARRAY[${sql.join(
          disallowTags.map((t) => sql`${t}`),
          sql`, `,
        )}]::text[])) > 0`;

  const filteredPostsQuery = db
    .select({
      ...getTableColumns(posts),
      tags: sql<
        string[]
      >`ARRAY_REMOVE(ARRAY_AGG(DISTINCT ${postTags.tag}), NULL)`.as("tags"),
      keywords: sql<
        string[]
      >`ARRAY_REMOVE(ARRAY_AGG(DISTINCT ${postKeywords.keyword}), NULL)`.as(
        "keywords",
      ),
      views: sql<number>`COALESCE(MAX(${views.count}), 0)`.as("views"),
      has_included_tag: sql<boolean>`${hasIncludedTagSql}`.as(
        "has_included_tag",
      ),
      has_disallowed_tag: sql<boolean>`${hasDisallowedTagSql}`.as(
        "has_disallowed_tag",
      ),
    })
    .from(posts)
    .leftJoin(postTags, eq(posts.slug, postTags.slug))
    .leftJoin(postKeywords, eq(posts.slug, postKeywords.slug))
    .leftJoin(views, eq(posts.slug, views.slug))
    .groupBy(posts.slug)
    .as("filtered_posts");

  const promise = db
    .select()
    .from(filteredPostsQuery)
    .where(
      and(
        tags.length === 0 ? sql`true` : filteredPostsQuery.has_included_tag,
        not(filteredPostsQuery.has_disallowed_tag),
      ),
    )
    .orderBy(desc(filteredPostsQuery.date))
    .limit(endInd - startInd)
    .offset(startInd);

  return fromPromise(promise, (error) => {
    console.error("Posts fetching error details:", error);
    return {
      message: `Error fetching posts. ${(error as Error).message}`,
      code: "DATABASE_ERROR",
    } as ContentError;
  }).map((postsWithTags) =>
    postsWithTags.map(
      (post) =>
        ({
          ...post,
          shortExcerpt: post.shortexcerpt,
          lastModified: post.lastmodified,
          coverSquare: post.coversquare,
          views: post.views && post.views > 0 ? post.views : 0,
        }) as Post,
    ),
  );
};

/**
 * Get the number of posts for given filters
 */
export const getPostsLength = ({
  tags = [],
  disallowTags = [],
}: {
  tags?: string[];
  disallowTags?: string[];
}) => {
  if (!disallowTags.includes(siteConfig.invisible)) {
    disallowTags.push(siteConfig.invisible);
  }

  const hasIncludedTagSql =
    tags.length === 0
      ? sql<boolean>`true`
      : sql<boolean>`COUNT(DISTINCT ${postTags.tag}) FILTER (WHERE ${postTags.tag} = ANY(ARRAY[${sql.join(
          tags.map((t) => sql`${t}`),
          sql`, `,
        )}]::text[])) > 0`;

  const hasDisallowedTagSql =
    disallowTags.length === 0
      ? sql<boolean>`false`
      : sql<boolean>`COUNT(DISTINCT ${postTags.tag}) FILTER (WHERE ${postTags.tag} = ANY(ARRAY[${sql.join(
          disallowTags.map((t) => sql`${t}`),
          sql`, `,
        )}]::text[])) > 0`;

  const filteredPostsQuery = db
    .select({
      slug: posts.slug,
      has_included_tag: sql<boolean>`${hasIncludedTagSql}`.as(
        "has_included_tag",
      ),
      has_disallowed_tag: sql<boolean>`${hasDisallowedTagSql}`.as(
        "has_disallowed_tag",
      ),
    })
    .from(posts)
    .leftJoin(postTags, eq(posts.slug, postTags.slug))
    .groupBy(posts.slug)
    .as("filtered_posts");

  const promise = db
    .select({ count: sql<number>`count(*)` })
    .from(filteredPostsQuery)
    .where(
      and(
        tags.length === 0 ? sql`true` : filteredPostsQuery.has_included_tag,
        not(filteredPostsQuery.has_disallowed_tag),
      ),
    );

  return fromPromise(
    promise,
    () =>
      ({
        message: "Error fetching posts length.",
        code: "DATABASE_ERROR",
      }) as ContentError,
  ).map((result) => Number(result[0].count));
};

/**
 * Get list of all tags used across posts using an optimized query.
 */
export const getListOfAllTags = () =>
  fromPromise(
    db
      .selectDistinct({ tag: postTags.tag })
      .from(postTags)
      .orderBy(asc(postTags.tag)),
    (error) => {
      console.error("Tags fetching error:", error);
      return {
        message: "Error fetching tags.",
        code: "DATABASE_ERROR",
      } as ContentError;
    },
  ).map((result) => result.map((row) => row.tag));

export function createPost(content: string, slug: string): Post {
  const { data: frontmatter, content: contentWithoutFrontmatter } =
    matter(content);

  const getStringValue = (value: unknown, defaultValue: string): string => {
    return typeof value === "string" ? value : defaultValue;
  };

  const getDateValue = (value: unknown, defaultValue: string) => {
    if (value instanceof Date) return value.toISOString();
    if (value) return new Date(value as string).toISOString();
    return defaultValue;
  };

  const getStringArray = (value: unknown): string[] => {
    return Array.isArray(value)
      ? (value.filter((item) => typeof item === "string") as string[])
      : [];
  };

  slug = getStringValue(frontmatter.slug, slug);

  const post: Post = {
    slug,
    title: getStringValue(frontmatter.title, slug),
    content: contentWithoutFrontmatter,
    description: getStringValue(frontmatter.description, ""),
    date: getDateValue(frontmatter.date, new Date().toISOString()),
    excerpt: getStringValue(frontmatter.excerpt, ""),
    locale: getStringValue(frontmatter.locale, "en_UK"),
    cover: typeof frontmatter.cover === "string" ? frontmatter.cover : null,
    coverSquare:
      typeof frontmatter.coverSquare === "string"
        ? frontmatter.coverSquare
        : null,
    lastModified: getDateValue(
      frontmatter.lastModified,
      new Date().toISOString(),
    ),
    shortened: getStringValue(frontmatter.shortened, slug),
    shortExcerpt: getStringValue(frontmatter.shortExcerpt, ""),
    tags: getStringArray(frontmatter.tags),
    keywords: getStringArray(frontmatter.keywords),
  };

  return post;
}
