import melikechan from '@/public/follow-next-images/melikechan.png';
import comeau from '@/public/follow-next-images/comeau.png';
import bendersky from '@/public/follow-next-images/bendersky.png';
import sophie from '@/public/follow-next-images/localghost.png';

const followNext = [
  {
    title: 'melikechan\'s blog',
    link: 'https://melikechan.vercel.app/',
    image: melikechan,
    description: 'Melike\'s blog is a place where she shares various things, including AI and being a researchering student.',
  },
  {
    title: 'Josh Comeau\'s Blog',
    link: 'https://www.joshwcomeau.com/',
    image: comeau,
    description: 'Josh Comeau is a front-end developer who writes about various things, including CSS and React.',
  },
  {
    title: 'Eli Bendersky\'s Website',
    link: 'https://eli.thegreenplace.net/',
    image: bendersky,
    description: 'Eli\'s blog is a place where he talks about programming, C++, Python, maths, and more.',
  },
  {
    title: 'Sophie\'s Localghost',
    link: 'https://localghost.dev/',
    image: sophie,
    description: 'Sophie\'s website is a cool place with an awesome design where she shares things about tech, web development, and mental health.',
  }
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