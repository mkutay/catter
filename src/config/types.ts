import type { comments, guestbook, posts } from "@/lib/db/schema";

export type DBPost = typeof posts.$inferSelect;

export type Post = DBPost & {
  tags: string[];
  keywords: string[];
  views?: number;
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

/**
 * Shared error type for all database query and action modules.
 */
export interface DatabaseError {
  message: string;
  code: "DATABASE_ERROR";
}

export interface AuthError {
  message: string;
  code: "AUTH_ERROR" | "UNAUTHORISED";
}

export const AVAILABILITY_TIME_ZONE = "Europe/London";

export const UKTime = new Intl.DateTimeFormat("en-GB", {
  timeZone: AVAILABILITY_TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export type BusyPeriod = { start: number; end: number };

export type Availability = {
  dayStart: number;
  dayEnd: number;
  busy: BusyPeriod[];
};
