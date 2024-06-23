'use client';

import Link from 'next/link';
import GithubSvg from '@/app/ui/githubSvg';
import RssSvg from '@/app/ui/rssSvg';

const items = [
  {'title': 'Sponsor Me', 'link': 'https://github.com/sponsors/mkutay?o=esb'},
  {'title': 'CV', 'link': '/pdfs/mehmet-kutay-bozkurt.pdf'},
];

export default function Footer() {
  return (
    <footer className="py-8 place-content-center max-w-prose mx-auto my-0">
      <div className="float-left sm:px-4 sm:pl-8 px-2 pl-4">
        Made with <b className="dark:text-[#f38ba8] text-[#d20f39]">&lt;3</b>
      </div>
      <div>
        <Link
          key="rss-svg"
          href="/feed.xml"
          className="float-right inline-block text-center sm:pl-4 pl-2  sm:pr-8 pr-4 hover:text-[#1e66f5] hover:dark:text-[#89b4fa] hover:underline"
          prefetch={true}
        >
          <RssSvg width={24} height={24}/>
        </Link>
        <Link
          key="github-svg"
          href="https://github.com/mkutay"
          className="float-right inline-block text-center sm:px-4 px-2 hover:text-[#1e66f5] hover:dark:text-[#89b4fa] hover:underline"
        >
          <GithubSvg width={24} height={24}/>
        </Link>
        {items.map((item) => (
          <Link
            key={item.link}
            href={item.link}
            className="float-right inline-block text-center sm:px-4 px-2 hover:text-[#1e66f5] hover:dark:text-[#89b4fa] hover:underline"
          >
            {item.title}
          </Link>
        ))}
      </div>
    </footer>
  );
}