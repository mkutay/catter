import type { comments, guestbook, posts } from "@/lib/db/schema";

export type DBPost = typeof posts.$inferSelect;

export type Post = DBPost & {
  tags: string[];
  keywords: string[];
  views?: number;
};

export type PostData = {
  slug: string;
  content: string;
  meta: PostMeta;
};

// Frontmatter on posts
export type PostMeta = {
  title: string;
  description: string;
  date: string;
  excerpt: string;
  locale: string;
  tags: string[];
  cover?: string;
  coverSquare?: string;
  lastModified: string;
  keywords?: string[];
  shortened: string;
  shortExcerpt?: string;
};

export type EntryData = typeof guestbook.$inferSelect;

export type CommentData = typeof comments.$inferSelect;

export const guestbookColors = [
  "rosewater",
  "flamingo",
  "pink",
  "mauve",
  "red",
  "maroon",
  "peach",
  "yellow",
  "green",
  "teal",
  "sky",
  "sapphire",
  "blue",
  "lavender",
  "text",
] as const;

export type GuestbookColorsType = (typeof guestbookColors)[number];
