export const siteConfig = {
  url: 'https://www.mkutay.dev',
  name: 'Kutay\'s Blog',
  author: 'Mehmet Kutay Bozkurt',
  authorEmail: 'hello@mkutay.dev',
  description: 'A blog where university student Kutay posts about things he likes, from mathematics to computer science.',
  navItems: [
    { label: 'About', href: '/about' },
    { label: 'Guest Book', href: '/guestbook' },
    { label: 'Projects', href: '/projects' },
    { label: 'Posts', href: '/posts/page/1' },
  ],
  footerItems: {
    connections: [
      { title: 'Twitter/X', link: 'https://x.com/mkutaybozkurt' },
      { title: 'Instagram', link: 'https://www.instagram.com/mkutaybozkurt' },
      { title: 'GitHub', link: 'https://github.com/mkutay' },
      { title: 'Resume', link: '/pdfs/mehmet-kutay-bozkurt.pdf' },
    ],
    blog: [
      { title: 'Sponsor Me', link: 'https://github.com/sponsors/mkutay?o=esb' },
      { title: 'Substack', link: 'https://mkutay.substack.com' },
      { title: 'RSS Feed', link: '/feed.xml' },
      { title: 'Admin', link: '/admin' },
    ],
  },
  date: new Date().toISOString().split('T')[0],
  tagsThatShouldBeCapital: [
    'ib',
  ],
  lastModifiedIsTrue: true,
  lastModifiedDate: new Date('2024-07-24'),
  admins: ['me@mkutay.dev', 'hello@mkutay.dev'],
  newsletterSubscribe: 'https://mkutay.substack.com/subscribe',
  adSenseClient: 'ca-pub-9198023121523009',
  postNumPerPage: 5,
};

export type postMeta = {
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
};

export type entryMeta = {
  id: number,
  body: string,
  created_by: string,
  created_at: string,
  updated_at: string,
  email: string,
  color: string,
};

export type commentMeta = {
  id: string,
  slug: string,
  body: string,
  created_by: string,
  created_at: string,
  updated_at: string,
  email: string,
};

export const guestbookColors = [
  { label: 'Rosewater', value: 'rosewater'},
  { label: 'Flamingo', value: 'flamingo'},
  { label: 'Pink', value: 'pink'},
  { label: 'Mauve', value: 'mauve'},
  { label: 'Red', value: 'red'},
  { label: 'Maroon', value: 'maroon'},
  { label: 'Peach', value: 'peach'},
  { label: 'Yellow', value: 'yellow'},
  { label: 'Green', value: 'green'},
  { label: 'Teal', value: 'teal'},
  { label: 'Sky', value: 'sky'},
  { label: 'Sapphire', value: 'sapphire'},
  { label: 'Blue', value: 'blue'},
  { label: 'Lavender', value: 'lavender'},
  { label: 'Text', value: 'text'},
];

export const guestbookColorsValue = [
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