const followNext = [
  {
    shortened: 'comeau',
    title: 'Josh Comeau\'s Blog',
    link: 'https://www.joshwcomeau.com/',
    imagePath: '/follow-next-images/comeau.png',
    description: 'Josh Comeau is a front-end developer who writes about various things, including CSS and React.',
  },
  {
    shortened: 'bendersky',
    title: 'Eli Bendersky\'s Website',
    link: 'https://eli.thegreenplace.net/',
    imagePath: '/follow-next-images/bendersky.png',
    description: 'Eli\'s blog is a place where he talks about programming, C++, Python, maths, and more.',
  },
  {
    shortened: 'sophie',
    title: 'Sophie\'s Localghost',
    link: 'https://localghost.dev/',
    imagePath: '/follow-next-images/localghost.png',
    description: 'Sophie\'s website is a cool place with an awesome design where she shares things about tech, web development, and mental health.',
  },
  {
    shortened: 'melikechan',
    title: 'melikechan\'s blog',
    link: 'https://melikechan.vercel.app/',
    imagePath: '/follow-next-images/melikechan.png',
    description: 'Melike\'s blog is a place where she shares various things, including AI and being a researchering student.',
  },
];

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
    'ai',
  ],
  postNumPerPage: 5,
  newsletterSubscribe: 'https://mkutay.substack.com/subscribe',
  admins: ['me@mkutay.dev', 'hello@mkutay.dev'],
  date: new Date().toISOString().split('T')[0],
  homePage: {
    leftSideSlugs: [
      'why-do-people-just-hate-mathematics',
      'skip-list',
    ],
    rightSideSlugs: [
      'why-mathematics-is-lonely',
      'how-to-practice-mathematics-as-an-art',
    ],
    middleSlug: 'creating-a-clone-of-yourself',
  },
  followNext,
};