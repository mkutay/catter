'use client';

import Link from 'next/link';
import ThemeChanger from '@/app/lib/themeChanger';

const items = [
  {'title': 'About', 'link': 'about'},
  {'title': 'Posts', 'link': 'posts/page/1'},
  {'title': 'Guest Book', 'link': 'guestbook'},
];

export default function NavBar() {
  return (
    <nav className="my-8 max-w-prose mx-auto flex flex-row">
      <div className="mr-auto px-4 text-[#8839ef] dark:text-[#cba6f7] hover:underline font-extrabold text-lg tracking-tight">
        <Link href="/">Kutay</Link>
      </div>
      <div className="ml-auto flex flex-row">
        {items.map((item) => (
          <Link
            key={item.link}
            href={`/${item.link}`}
            className="text-center px-2 hover:text-[#1e66f5] hover:dark:text-[#89b4fa] hover:underline"
          >
            {item.title}
          </Link>
        ))}
        <div className="px-4 pl-2"><ThemeChanger/></div>
      </div>
    </nav>
  );
}