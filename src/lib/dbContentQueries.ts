import { and, asc, desc, eq, getTableColumns, not, sql } from "drizzle-orm";
import matter from "gray-matter";
import { errAsync, fromPromise, okAsync, type ResultAsync } from "neverthrow";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import type { Post } from "@/config/types";
import { db } from "./db/drizzle";
import { postKeywords, posts, postTags, views } from "./db/schema";

interface ContentError {
  message: string;
  code: "DATABASE_ERROR";
}

const normalizeImageReference = (value: unknown): string | null => {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  if (trimmed.length === 0) return null;

  const wikiLinkMatch = trimmed.match(/^\[\[(.+)\]\]$/);
  return wikiLinkMatch?.[1]?.trim() || trimmed;
};

const getContentError = (message: string, error?: unknown): ContentError => {
  console.error(message, "Database error details:", error);
  return {
    message: `${message}${error instanceof Error ? ` ${error.message}` : ""}`,
    code: "DATABASE_ERROR",
  };
};

interface PostTagFilters {
  tags?: string[];
  disallowTags?: string[];
}

const buildTagFilterSql = ({
  tags,
  disallowTags,
}: Required<PostTagFilters>) => {
  const effectiveDisallowTags = disallowTags.includes(siteConfig.invisible)
    ? disallowTags
    : [...disallowTags, siteConfig.invisible];

  const hasIncludedTagSql =
    tags.length === 0
      ? sql<boolean>`true`
      : sql<boolean>`COUNT(DISTINCT ${postTags.tag}) FILTER (WHERE ${postTags.tag} = ANY(ARRAY[${sql.join(
          tags.map((tag) => sql`${tag}`),
          sql`, `,
        )}]::text[])) > 0`;

  const hasDisallowedTagSql =
    effectiveDisallowTags.length === 0
      ? sql<boolean>`false`
      : sql<boolean>`COUNT(DISTINCT ${postTags.tag}) FILTER (WHERE ${postTags.tag} = ANY(ARRAY[${sql.join(
          effectiveDisallowTags.map((tag) => sql`${tag}`),
          sql`, `,
        )}]::text[])) > 0`;

  return {
    hasIncludedTagSql,
    hasDisallowedTagSql,
  };
};

/**
 * Get all post files from the posts directory.
 */
export const getPostSlugs = (): ResultAsync<string[], ContentError> =>
  fromPromise(db.select({ slug: posts.slug }).from(posts), () => ({
    message: "Error fetching post slugs.",
    code: "DATABASE_ERROR" as const,
  })).map((values) => values.map((value) => value.slug));

export const doesPostWithSlugExist = (
  slug: string,
): ResultAsync<boolean, ContentError> =>
  fromPromise(
    db.select({ slug: posts.slug }).from(posts).where(eq(posts.slug, slug)),
    (err) => getContentError("Error checking post existence.", err),
  ).map((values) => values.length > 0);

// This function does not convert and parse content.
export const getPost = (slug: string): ResultAsync<Post, ContentError> =>
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
    (err) => getContentError(`Error fetching post with slug "${slug}".`, err),
  )
    .andThrough((result) => {
      if (result.length === 0 || !result[0]) notFound();
      return okAsync(result);
    })
    .map((result) => result[0])
    .andThen((post) =>
      post.content &&
      post.title &&
      post.description &&
      post.date &&
      post.locale &&
      post.lastModified &&
      post.shortened &&
      post.excerpt !== null
        ? okAsync(post)
        : errAsync(
            getContentError(
              `Post with slug "${slug}" has missing required fields.`,
            ),
          ),
    )
    .map((post) => ({
      ...post,
      shortExcerpt: post.shortExcerpt,
      lastModified: post.lastModified,
      cover: normalizeImageReference(post.cover),
      coverSquare: normalizeImageReference(post.coverSquare),
      tags: post.tags || [],
      keywords: post.keywords || [],
    }));

/**
 * Get posts based on filters.
 * This function does not convert and parse content.
 */
export const getPosts = ({
  tags = [],
  disallowTags = [],
}: {
  startInd?: number;
  endInd?: number;
} & PostTagFilters): ResultAsync<Post[], ContentError> => {
  const { hasIncludedTagSql, hasDisallowedTagSql } = buildTagFilterSql({
    tags,
    disallowTags,
  });

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
    .orderBy(desc(filteredPostsQuery.date));

  return fromPromise(promise, (err) =>
    getContentError(`Error fetching posts.`, err),
  ).map((postsWithTags) =>
    postsWithTags.map((post) => ({
      ...post,
      shortExcerpt: post.shortExcerpt,
      lastModified: post.lastModified,
      cover: normalizeImageReference(post.cover),
      coverSquare: normalizeImageReference(post.coverSquare),
      views: post.views && post.views > 0 ? post.views : 0,
    })),
  );
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
    (err) => getContentError(`Error fetching list of all tags.`, err),
  ).map((result) => result.map((row) => row.tag));

export function createPost(content: string, slug: string): Post {
  const { data: frontmatter, content: contentWithoutFrontmatter } =
    matter(content);

  slug = getStringValue(frontmatter.slug, slug);

  return {
    slug,
    title: getStringValue(frontmatter.title, slug),
    content: contentWithoutFrontmatter,
    description: getStringValue(frontmatter.description, ""),
    date: getDateValue(frontmatter.date, new Date().toISOString()),
    excerpt: getStringValue(frontmatter.excerpt, ""),
    locale: getStringValue(frontmatter.locale, "en_UK"),
    cover: normalizeImageReference(frontmatter.cover),
    coverSquare: normalizeImageReference(frontmatter.coverSquare),
    lastModified: getDateValue(
      frontmatter.lastModified,
      new Date().toISOString(),
    ),
    shortened: getStringValue(frontmatter.shortened, slug),
    shortExcerpt: getStringValue(frontmatter.shortExcerpt, ""),
    tags: getStringArray(frontmatter.tags),
    keywords: getStringArray(frontmatter.keywords),
  };
}

const getStringValue = (value: unknown, defaultValue: string): string =>
  typeof value === "string" ? value : defaultValue;

const getDateValue = (value: unknown, defaultValue: string) => {
  if (value instanceof Date) return value.toISOString();
  if (value) return new Date(value as string).toISOString();
  return defaultValue;
};

const getStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
