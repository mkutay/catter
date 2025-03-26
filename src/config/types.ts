export type postMetaType = {
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

export type entryType = {
  id: number,
  body: string,
  created_by: string,
  created_at: string,
  updated_at: string,
  email: string,
  color: string,
};

export type commentType = {
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