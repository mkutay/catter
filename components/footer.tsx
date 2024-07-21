'use client';

import Link from 'next/link';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';

import { GithubSvg } from '@/components/icons';
import { RssSvg } from '@/components/icons';
import { Button } from '@/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/dropdown';

const items = [
  {'title': 'RSS Feed', 'link': '/feed.xml'},
  {'title': 'My GitHub', 'link': 'https://github.com/mkutay'},
  {'title': 'Sponsor Me', 'link': 'https://github.com/sponsors/mkutay?o=esb'},
  {'title': 'CV', 'link': '/pdfs/mehmet-kutay-bozkurt.pdf'},
];

export default function Footer() {
  return (
    <footer className="my-8 flex flex-row max-w-prose lg:max-w-6xl mx-auto items-center">
      <div className="mr-auto px-4">
        Made with <b className="dark:text-[#f38ba8] text-[#d20f39]">&lt;3</b>
      </div>
      <div className="ml-auto flex flex-row">
        <div className="hidden lg:flex">
          {items.map((item) => (item.title !== 'RSS Feed' && item.title !== 'My GitHub' && (
            <Link
              key={item.link}
              href={item.link}
              className="float-right inline-block text-center px-2 hover:text-[#1e66f5] hover:dark:text-[#89b4fa] hover:underline"
            >
              {item.title}
            </Link>
          )))}
          <Link
            key="github-svg"
            href="https://github.com/mkutay"
            className="float-right inline-block text-center px-2 hover:text-[#1e66f5] hover:dark:text-[#89b4fa] hover:underline"
          >
            <GithubSvg width={24} height={24}/>
          </Link>
          <Link
            key="rss-svg"
            href="/feed.xml"
            className="float-right inline-block text-center pl-2 pr-4 hover:text-[#1e66f5] hover:dark:text-[#89b4fa] hover:underline"
            prefetch={true}
          >
            <RssSvg width={24} height={24}/>
          </Link>
        </div>
        <div className="items-center lg:hidden flex px-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <HamburgerMenuIcon stroke="currentColor" strokeWidth="1px"/>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="right-4">
              {items.map((item) => (
                <DropdownMenuItem key={item.link}>
                  <Link
                    href={item.link}
                    className="float-right inline-block text-center px-2 text-lg"
                  >
                    {item.title}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </footer>
  );
}