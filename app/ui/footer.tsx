'use client';

import Link from 'next/link';
import ThemeChanger from '@/app/lib/themeChanger';

const items = [
  {'title': 'Sponsor Me', 'link': 'https://github.com/sponsors/mkutay?o=esb'},
  {'title': 'Résumé', 'link': 'https://mkutay.dev/assets/pdfs/mehmet-kutay-bozkurt.pdf'},
];

export default function Footer() {
  return (
    <footer className="h-8 place-content-center">
      <div className="float-left px-4 pl-8">
        <Link href="/">
          Made with
          <div className="dark:text-[#f38ba8] text-[#d20f39]">
            &lt;3
          </div>
        </Link>
      </div>
      <div className="pr-4">
        {items.map((item) => (
          <Link
            href={`${item.link}`}
            className="float-right inline-block text-center px-4 hover:text-[#1e66f5] hover:dark:text-[#89b4fa] hover:underline"
          >
            {item.title}
          </Link>
        ))}
      </div>
      <div><ThemeChanger/></div>
    </footer>
  );
}