export type PostData = {
  slug: string;
  content: string;
  meta: PostMeta;
};

// Frontmatter on posts
export type PostMeta = {
  title: string,
  description: string,
  date: string,
  excerpt: string,
  locale: string,
  tags: string[],
  cover: string,
  coverSquare: string,
  lastModified: string,
  keywords: string[],
  shortened: string,
  shortExcerpt?: string,
};

export type EntryData = {
  id: number,
  body: string,
  created_by: string,
  created_at: string,
  updated_at: string,
  email: string,
  color: string,
};

export type CommentData = {
  id: string,
  slug: string,
  body: string,
  created_by: string,
  created_at: string,
  updated_at: string,
  email: string,
};

export const guestbookColors = [
  'rosewater',
  'flamingo',
  'pink',
  'mauve',
  'red',
  'maroon',
  'peach',
  'yellow',
  'green',
  'teal',
  'sky',
  'sapphire',
  'blue',
  'lavender',
  'text',
] as const;

export type GuestbookColorsType = "rosewater" | "flamingo" | "pink" | "mauve" | "red" | "maroon" | "peach" | "yellow" | "green" | "teal" | "sky" | "sapphire" | "blue" | "lavender" | "text";

export type ViewCount = {
  slug: string;
  count: number;
};