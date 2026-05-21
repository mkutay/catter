import {
  foreignKey,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * The table for comments on the blog.
 */
export const comments = pgTable("comments", {
  id: serial().primaryKey().notNull(),
  email: varchar({ length: 255 }).notNull(),
  slug: text().notNull(),
  body: text().notNull(),
  createdBy: varchar("created_by", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }),
});

/**
 * The table for guestbook entries.
 */
export const guestbook = pgTable("guestbook", {
  id: serial().primaryKey().notNull(),
  email: varchar({ length: 255 }).notNull(),
  body: text().notNull(),
  createdBy: varchar("created_by", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }),
  /**
   * The color of the comment in the guestbook author text.
   *
   * This uses Catppuccin colour palette.
   */
  color: varchar({ length: 255 }),
});

/**
 * The table for tracking the number of views for each post.
 */
export const views = pgTable("views", {
  slug: text().primaryKey().notNull(),
  count: integer(),
});

/**
 * The table for blog posts.
 */
export const posts = pgTable("posts", {
  slug: varchar({ length: 255 }).primaryKey().notNull(),
  content: text().notNull(),
  title: text().notNull(),
  description: text().notNull(),
  date: timestamp({ mode: "string" }).notNull(),
  excerpt: text().notNull(),
  locale: text().notNull(),
  cover: text(),
  coverSquare: text(),
  lastModified: timestamp({ mode: "string" }).notNull(),
  shortened: varchar({ length: 255 }).notNull(),
  shortExcerpt: text(),
});

/**
 * The table for keywords associated with each post.
 */
export const postKeywords = pgTable(
  "post_keywords",
  {
    slug: varchar({ length: 255 }).notNull(),
    keyword: text().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.slug],
      foreignColumns: [posts.slug],
      name: "post_keywords_slug_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    primaryKey({
      columns: [table.slug, table.keyword],
      name: "post_keywords_pkey",
    }),
  ],
);

/**
 * The table for tags associated with each post.
 */
export const postTags = pgTable(
  "post_tags",
  {
    slug: varchar({ length: 255 }).notNull(),
    tag: text().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.slug],
      foreignColumns: [posts.slug],
      name: "post_tags_slug_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    primaryKey({ columns: [table.tag, table.slug], name: "post_tags_pkey" }),
  ],
);

/**
 * Simple (key, value) store.
 */
export const keyValues = pgTable("key_values", {
  key: text().primaryKey(),
  value: text().notNull(),
});
