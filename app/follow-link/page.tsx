import Link from 'next/link';

import DoublePane from '@/components/doublePane';

const websites = [
  {
    title: 'melikechan\'s blog',
    link: 'https://melikechan.vercel.app/',
  },
  {
    title: 'Josh Comeau\'s Blog',
    link: 'https://www.joshwcomeau.com/',
  },
  {
    title: 'Eli Bendersky\'s Website',
    link: 'https://eli.thegreenplace.net/',
  },
  {
    title: 'Sophie\'s Personal Website',
    link: 'https://localghost.dev/',
  }
]

export default function Page() {
  return (
    <DoublePane hideFollowLink={true}>
      <h1 className="scroll-m-20 text-2xl font-semibold tracking-wide text-primary uppercase my-6">
        Follow all these awesome people
      </h1>
      <div className="grid sm:grid-cols-2 grid-cols-1 gap-2">
        {websites.map((website) => (
          <Link key={website.title} href={website.link} className="text-center rounded-lg border border-border p-4 text-lg font-semibold bg-background text-foreground hover:bg-muted hover:text-muted-foreground transition-all">
            {website.title}
          </Link>
        ))}
      </div>
    </DoublePane>
  )
}