import path from "node:path";
import { and, asc, desc, eq, getTableColumns, not, sql } from "drizzle-orm";
import fs from "fs";
import matter from "gray-matter";
import { fromPromise, okAsync, type ResultAsync } from "neverthrow";
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
 * Normalises an image reference from the database.
 *
 * Handles wiki-style links like [[image.jpg]] and simple strings.
 */
const normaliseImageReference = (value: unknown): string | null => {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  if (trimmed.length === 0) return null;

  const wikiLinkMatch = trimmed.match(/^\[\[(.+)\]\]$/);
  return wikiLinkMatch?.[1]?.trim() || trimmed;
};

/**
 * Formats a database error into a structured ContentError.
 */
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

/**
 * Builds SQL filters for tags, handling both inclusion and exclusion.
 *
 * Uses PostgreSQL ANY and ARRAY to efficiently filter posts based on their associated tags.
 */
const buildTagFilterSql = ({
  tags,
  disallowTags,
}: Required<PostTagFilters>) => {
  const effectiveDisallowTags = disallowTags.includes(siteConfig.invisible)
    ? disallowTags
    : [...disallowTags, siteConfig.invisible];

  // Including posts that have at least one of the specified tags.
  const hasIncludedTagSql =
    tags.length === 0
      ? sql<boolean>`true`
      : sql<boolean>`COUNT(DISTINCT ${postTags.tag}) FILTER (WHERE ${postTags.tag} = ANY(ARRAY[${sql.join(
          tags.map((tag) => sql`${tag}`),
          sql`, `,
        )}]::text[])) > 0`;

  // Excluding posts that have any of the disallowed tags.
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
 * Fetches all post slugs from the database.
 */
export const getPostSlugs = (): ResultAsync<string[], ContentError> =>
  fromPromise(db.select({ slug: posts.slug }).from(posts), () => ({
    message: "Error fetching post slugs.",
    code: "DATABASE_ERROR" as const,
  })).map((values) => values.map((value) => value.slug));

/**
 * Checks if a post with the given slug exists in the database.
 */
export const doesPostWithSlugExist = (
  slug: string,
): ResultAsync<boolean, ContentError> =>
  fromPromise(
    db.select({ slug: posts.slug }).from(posts).where(eq(posts.slug, slug)),
    (err) => getContentError("Error checking post existence.", err),
  ).map((values) => values.length > 0);

/**
 * Fetches a single post by its slug, including its tags and keywords.
 *
 * @note This function retrieves raw content and does not parse MDX.
 */
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
    .andThen((result) => {
      if (result.length === 0 || !result[0]) notFound();
      return okAsync(result[0]);
    })
    .map((post) => ({
      ...post,
      cover: normaliseImageReference(post.cover),
      coverSquare: normaliseImageReference(post.coverSquare),
    }));

/**
 * Fetches a list of posts based on tag filters.
 *
 * @note This function retrieves raw content and does not parse MDX.
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
      cover: normaliseImageReference(post.cover),
      coverSquare: normaliseImageReference(post.coverSquare),
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

/**
 * Creates a Post object from raw content and slug, parsing frontmatter if present.
 */
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
    cover: normaliseImageReference(frontmatter.cover),
    coverSquare: normaliseImageReference(frontmatter.coverSquare),
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

/**
 * Ensures a value is a string, otherwise returns a default value.
 */
const getStringValue = (value: unknown, defaultValue: string): string =>
  typeof value === "string" ? value : defaultValue;

/**
 * Parses a date value into an ISO string, using a default if parsing fails.
 */
const getDateValue = (value: unknown, defaultValue: string) => {
  if (value instanceof Date) return value.toISOString();
  if (value) return new Date(value as string).toISOString();
  return defaultValue;
};

/**
 * Ensures a value is an array of strings.
 */
const getStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];

/**
 * Fetches the content and metadata for the 'About' page from the filesystem.
 *
 * Parses the MDX file located at `src/app/about/about.mdx`.
 */
export function getAboutProps() {
  let markdownFile: string;
  try {
    markdownFile = fs.readFileSync(
      path.join(process.cwd(), path.join("src/app/about/about.mdx")),
      "utf-8",
    );
  } catch (error) {
    console.error(error);
    notFound();
  }

  const { data: frontMatter, content } = matter(markdownFile);

  const postData = {
    meta: frontMatter as {
      title: string;
      description: string;
      date: string;
    },
    content: content,
  };

  return postData;
}
