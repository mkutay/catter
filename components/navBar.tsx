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
    <nav className="my-8 max-w-prose lg:max-w-6xl mx-auto flex flex-row items-center place-items-center justify-center">
      <div className="mr-auto place-items-center px-4 lg:px-8 text-[#8839ef] dark:text-[#cba6f7] hover:underline font-extrabold text-lg gap-2 flex flex-row items-center">
        <Link href="/" className="flex flex-row items-center gap-2">
          <Logo className="flex-none"/>
          Kutay&#39;s Blog
        </Link>
      </div>
      <div className="ml-auto flex flex-row place-items-center">
        <div className="hidden lg:flex">
          {siteConfig.navItems.map((item) => (
            <Link
              key={item.href}
              href={`${item.href}`}
              className="text-center px-2 hover:text-[#1e66f5] hover:dark:text-[#89b4fa] hover:underline"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="px-2 lg:px-8 lg:pl-2"><ThemeChanger/></div>
        <div className="flex lg:hidden px-4 pl-2 lg:px-0">
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
                <DropdownMenuItem key={item.href} asChild>
                  <Link
                    href={`${item.href}`}
                    className="text-center text-lg px-1"
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