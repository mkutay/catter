'use client';

import Link from 'next/link';
import ThemeChanger from '@/app/lib/themeChanger';

const items = [
  {'title': 'Sponsor Me', 'link': 'https://github.com/sponsors/mkutay?o=esb'},
  {'title': 'Résumé', 'link': 'https://www.mkutay.dev/pdfs/mehmet-kutay-bozkurt.pdf'},
];

export default function Footer() {
  return (
    <footer className="py-8 place-content-center max-w-prose mx-auto my-0">
      <div className="float-left sm:px-4 sm:pl-8 px-2 pl-4">
        Made with <b className="dark:text-[#f38ba8] text-[#d20f39]">&lt;3</b>
      </div>
      <div className="float-right sm:px-4 sm:pr-8 px-2 pr-4"><ThemeChanger/></div>
      <div>
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