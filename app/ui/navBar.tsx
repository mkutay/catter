'use client';

import Link from 'next/link';

const items = [
  {'title': 'Guest Book', 'link': 'guestbook'},
  {'title': 'Posts', 'link': 'pages/posts'},
  {'title': 'About', 'link': 'pages/about'},
];

export default function NavBar() {
  return (
    <nav className="py-8 place-content-center max-w-prose mx-auto my-0">
      <div className="float-left sm:px-4 sm:pl-8 px-2 pl-4 text-[#8839ef] dark:text-[#cba6f7] hover:underline font-bold">
        <Link href="/">Kutay</Link>
      </div>
      <div className="sm:pr-4 pr-2">
        {items.map((item) => (
          <Link
            key={item.link}
            href={`/${item.link}`}
            className="float-right inline-block text-center px-2 sm:px-4 hover:text-[#1e66f5] hover:dark:text-[#89b4fa] hover:underline"
          >
            {item.title}
          </Link>
        ))}
      </div>
    </nav>
  );
}