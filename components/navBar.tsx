'use client';

import Link from 'next/link';
import ThemeChanger from '@/components/themeChanger';
import { Logo } from '@/components/icons';
import { siteConfig } from '@/config/site';

export default function NavBar() {
  return (
    <nav className="my-8 max-w-prose mx-auto flex flex-row items-center">
      <div className="mr-auto px-4 text-[#8839ef] dark:text-[#cba6f7] hover:underline font-extrabold text-lg gap-2 flex flex-row items-center">
        <Link href="/" className="flex flex-row items-center gap-2">
          <Logo className="flex-none"/>
          Kutay&#39;s Blog
        </Link>
      </div>
      <div className="ml-auto flex flex-row">
        {siteConfig.navItems.map((item) => (
          <Link
            key={item.href}
            href={`${item.href}`}
            className="text-center px-2 hover:text-[#1e66f5] hover:dark:text-[#89b4fa] hover:underline"
          >
            {item.label}
          </Link>
        ))}
        <div className="px-4 pl-2"><ThemeChanger/></div>
      </div>
    </nav>
  );
}