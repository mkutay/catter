'use client';

import Link from 'next/link';
import ThemeChanger from '@/app/lib/themeChanger';

const items = [
  {'title': 'Guest Book', 'link': 'guestbook'},
  {'title': 'Posts', 'link': 'posts/page/1'},
  {'title': 'About', 'link': 'about'},
];

export default function NavBar() {
  return (
    <nav className="py-8 max-w-prose mx-auto my-0 place-content-center">
      <div className="float-left px-4 text-[#8839ef] dark:text-[#cba6f7] hover:underline font-extrabold text-xl">
        <Link href="/">Kutay</Link>
      </div>
      <div className="float-right px-4 pl-2"><ThemeChanger/></div>
      <div className="pr-2">
        {items.map((item) => (
          <Link
            key={item.link}
            href={`/${item.link}`}
            className="float-right inline-block text-center px-2 hover:text-[#1e66f5] hover:dark:text-[#89b4fa] hover:underline"
          >
            {item.title}
          </Link>
        ))}
      </div>
    </nav>
  );
}