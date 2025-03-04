export const siteConfig = {
  url: 'https://www.mkutay.dev',
  name: 'The Deterministic',
  author: 'Mehmet Kutay Bozkurt',
  authorEmail: 'hello@mkutay.dev',
  description: 'A blog that talks about various things from mathematics to computer science and from philosophy to life updates.',
  navItems: [
    { label: 'About', href: '/about' },
    { label: 'Guest Book', href: '/guestbook' },
    { label: 'Projects', href: '/projects' },
    { label: 'Posts', href: '/posts/page/1' },
  ],
  footerItems: {
    connections: [
      { title: 'BlueSky', link: 'https://bsky.app/profile/mkutay.substack.com' },
      { title: 'Instagram', link: 'https://www.instagram.com/mkutaybozkurt' },
      { title: 'GitHub', link: 'https://github.com/mkutay' },
      { title: 'Resume (Old)', link: '/pdfs/mehmet-kutay-bozkurt.pdf' },
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