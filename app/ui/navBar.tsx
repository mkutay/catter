'use client';

import Link from 'next/link';

const items = [
  {'title': 'About', 'link': 'about'},
  {'title': 'Academia', 'link': 'academia'},
  {'title': 'Archive', 'link': 'archive'},
];

export default function NavBar() {
  return (
    <header>
      <Link href="/">
        Deterministic Blog
      </Link>
      <nav>
        {items.map((item) => (
          <Link
            key={item.link}
            href={`/${item.link}`}
          >
            {item.title}
          </Link>
        ))}
      </nav>
    </header>
  );
}