export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  url: 'https://www.mkutay.dev',
  name: "Kutay's Blog",
  description: "A blog where university student Kutay posts about things he likes, from mathematics to computer science.",
  postNumPerPage: 5,
  navItems: [
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Guest Book",
      href: "/guestbook",
    },
    // {
    //   label: "Projects",
    //   href: "/projects",
    // },
    {
      label: "Posts",
      href: "/posts/page/1",
    },
  ],
  navMenuItems: [
    {
      label: "Home Page",
      href: "/",
    },
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Posts",
      href: "/posts/page/1",
    },
  ],
  date: new Date().toISOString().split('T')[0],
  tagsThatShouldBeCapital: [
    'ib',
  ],
  lastModifiedIsTrue: true,
  lastModifiedDate: new Date('2024-07-24'),
  footerItems: {
    'connections': [
      {'title': 'Twitter/X', 'link': 'https://x.com/mkutaybozkurt'},
      {'title': 'Instagram', 'link': 'https://www.instagram.com/mkutaybozkurt'},
      {'title': 'GitHub', 'link': 'https://github.com/mkutay'},
      {'title': 'Resume', 'link': '/pdfs/mehmet-kutay-bozkurt.pdf'},
    ],
    'blog': [
      {'title': 'Sponsor Me', 'link': 'https://github.com/sponsors/mkutay?o=esb'},
      {'title': 'About Me', 'link': '/about'},
      {'title': 'Substack', 'link': 'https://mkutay.substack.com'},
      {'title': 'RSS Feed', 'link': '/feed.xml'},
    ],
  },
  codes: ['abracadabra'],
  codesStyles: {
    'abracadabra': 'text-maroon',
  },
  siteAdmins: ['hello@mkutay.dev'],
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
  id: string,
  body: string,
  created_by: string,
  created_at: string,
  updated_at: string,
  email: string,
};