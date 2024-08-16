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
  tagsThatShouldBeCapital: [
    'ib',
  ],
  postNumPerPage: 5,
  newsletterSubscribe: 'https://mkutay.substack.com/subscribe',
  admins: ['me@mkutay.dev', 'hello@mkutay.dev'],
  date: new Date().toISOString().split('T')[0],
};