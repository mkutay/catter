import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  foreignKey,
  primaryKey,
} from "drizzle-orm/pg-core";

export const comments = pgTable("comments", {
  id: serial().primaryKey().notNull(),
  email: varchar({ length: 255 }).notNull(),
  slug: text().notNull(),
  body: text().notNull(),
  createdBy: varchar("created_by", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }),
});

export const guestbook = pgTable("guestbook", {
  id: serial().primaryKey().notNull(),
  email: varchar({ length: 255 }).notNull(),
  body: text().notNull(),
  createdBy: varchar("created_by", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }),
  color: varchar({ length: 255 }),
});

export const views = pgTable("views", {
  slug: text().primaryKey().notNull(),
  count: integer(),
});

export const posts = pgTable("posts", {
  slug: varchar({ length: 255 }).primaryKey().notNull(),
  content: text().notNull(),
  title: text().notNull(),
  description: text().notNull(),
  date: timestamp({ mode: "string" }).notNull(),
  excerpt: text().notNull(),
  locale: text().notNull(),
  cover: text(),
  coversquare: text(),
  lastmodified: timestamp({ mode: "string" }).notNull(),
  shortened: varchar({ length: 255 }).notNull(),
  shortexcerpt: text(),
});

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
