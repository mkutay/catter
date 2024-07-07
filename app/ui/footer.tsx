'use client';

import Link from 'next/link';
import { GithubSvg } from '@/app/ui/icons';
import { RssSvg } from '@/app/ui/icons';

const items = [
  {'title': 'Sponsor Me', 'link': 'https://github.com/sponsors/mkutay?o=esb'},
  {'title': 'CV', 'link': '/pdfs/mehmet-kutay-bozkurt.pdf'},
];

export default function Footer() {
  return (
    <footer className="my-8 flex flex-row max-w-prose mx-auto">
      <div className="mr-auto px-4">
        Made with <b className="dark:text-[#f38ba8] text-[#d20f39]">&lt;3</b>
      </div>
      <div className="ml-auto flex flex-row">
        <div>
          <Link
            key="rss-svg"
            href="/feed.xml"
            className="float-right inline-block text-center pl-2 pr-4 hover:text-[#1e66f5] hover:dark:text-[#89b4fa] hover:underline"
            prefetch={true}
          >
            <RssSvg width={24} height={24}/>
          </Link>
          <Link
            key="github-svg"
            href="https://github.com/mkutay"
            className="float-right inline-block text-center px-2 hover:text-[#1e66f5] hover:dark:text-[#89b4fa] hover:underline"
          >
            <GithubSvg width={24} height={24}/>
          </Link>
          {items.map((item) => (
            <Link
              key={item.link}
              href={item.link}
              className="float-right inline-block text-center px-2 hover:text-[#1e66f5] hover:dark:text-[#89b4fa] hover:underline"
            >
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}