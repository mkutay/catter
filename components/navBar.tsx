'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Cross1Icon, HamburgerMenuIcon } from '@radix-ui/react-icons';
import { SVGProps } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import ThemeChanger from '@/components/themeChanger';
import { siteConfig } from '@/config/site';

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

// This is the logo that will be displayed on the navbar. You can change this as you desire
export const Logo: React.FC<IconSvgProps> = ({
  size = 36,
  width,
  height,
  ...props
}) => (
  <svg
    fill="none"
    height={size || height}
    viewBox="286 300 1400 1400"
    width={size || width}
    {...props}
  >
    <g clipPath="url(#ArtboardFrame)">
      <path d="M1949.61 48.7391L1949.61 1950.77L1293.66 1950.77L1293.66 48.7391L1949.61 48.7391Z" fill="none" opacity="1" stroke="currentColor" strokeLinecap="butt" strokeLinejoin="miter" strokeWidth="120"/>
      <path d="M678.17 48.7391L678.17 1950.77L50.2695 1950.77L50.2695 48.7391L678.17 48.7391Z" fill="none" opacity="1" stroke="currentColor" strokeLinecap="butt" strokeLinejoin="miter" strokeWidth="120"/>
        <path d="M999.997 1176.75L648.478 822.756" fill="none" opacity="1" stroke="currentColor" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="120"/>
        <path d="M356.343 1169.82L714.94 822.99" fill="none" opacity="1" stroke="currentColor" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="120"/>
        <path d="M971.827 823.375L1324.59 1176.14" fill="none" opacity="1" stroke="currentColor" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="120"/>
        <path d="M1615.5 828.052L1258.13 1176.14" fill="none" opacity="1" stroke="currentColor" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="120"/>
    </g>
  </svg>
);

export default function NavBar() {
  const [triggered, setTriggered] = useState(false);

  return (
    <nav className="my-4 max-w-prose lg:max-w-6xl mx-auto flex flex-row items-center justify-between px-4">
      <div className="place-items-center text-primary hover:text-primary/80 transition-all font-extrabold text-lg gap-2 flex flex-row items-center">
        <Link href="/" className="flex flex-row items-center gap-2">
          <Logo className="flex-none"/>
          Kutay&#39;s Blog
        </Link>
      </div>
      <div className="flex flex-row place-items-center gap-4">
        <div><ThemeChanger/></div>
        <div className="hidden lg:flex flex-row gap-4">
          {siteConfig.navItems.map((item) => (
            <Link
              key={item.href}
              href={`${item.href}`}
              className="text-center hover:text-primary transition-all"
            >
              {item.label}
            </Link>
          ))}
        </div>
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