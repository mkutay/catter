'use client';

import Link from 'next/link';

const items = [
  {'title': 'Archive', 'link': 'archive'},
  {'title': 'Academia', 'link': 'academia'},
  {'title': 'About', 'link': 'about'},
];

export default function NavBar() {
  return (
    <nav className="py-8 place-content-center">
      <div className="float-left px-4 pl-8 text-[#8839ef] dark:text-[#cba6f7] hover:underline font-bold">
        <Link href="/">Kutay</Link>
      </div>
      <div className="pr-4">
        {items.map((item) => (
          <Link
            key={item.link}
            href={`/${item.link}`}
            className="float-right inline-block text-center px-4 hover:text-[#1e66f5] hover:dark:text-[#89b4fa] hover:underline"
          >
            {item.title}
          </Link>
        ))}
      </div>
    </nav>
  );
}