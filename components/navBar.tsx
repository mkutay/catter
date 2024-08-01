'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Cross1Icon, HamburgerMenuIcon } from '@radix-ui/react-icons';

import { Logo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import ThemeChanger from '@/components/themeChanger';
import { siteConfig } from '@/config/site';

export default function NavBar() {
  const [triggered, setTriggered] = useState(false);

  return (
    <nav className="my-4 max-w-prose lg:max-w-6xl mx-auto flex flex-row items-center justify-between px-4">
      <div className="place-items-center text-[#8839ef] dark:text-[#cba6f7] hover:underline font-extrabold text-lg gap-2 flex flex-row items-center">
        <Link href="/" className="flex flex-row items-center gap-2">
          <Logo className="flex-none"/>
          Kutay&#39;s Blog
        </Link>
      </div>
      <div className="flex flex-row place-items-center gap-4">
        <div className="hidden lg:flex flex-row gap-4">
          {siteConfig.navItems.map((item) => (
            <Link
              key={item.href}
              href={`${item.href}`}
              className="text-center hover:text-[#1e66f5] hover:dark:text-[#89b4fa] hover:underline"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div><ThemeChanger/></div>
        <div className="flex lg:hidden">
          <DropdownMenu onOpenChange={() => setTriggered(triggered ? false : true)}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="dropdown menu for linking the website">
                {triggered === true ? (
                  <Cross1Icon stroke="currentColor" strokeWidth="1px"/>
                ) : (
                  <HamburgerMenuIcon stroke="currentColor" strokeWidth="1px"/>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {siteConfig.navItems.map((item) => (
                <DropdownMenuItem key={item.href} asChild className="text-md font-medium">
                  <Link
                    href={`${item.href}`}
                  >
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}