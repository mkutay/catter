'use client';

import Link from 'next/link';

import { siteConfig } from '@/config/site';

export default function Footer() {
  return (
    <footer className="items-center lg:items-start lg:px-8 px-4 my-12 flex lg:flex-row flex-col max-w-prose lg:max-w-6xl mx-auto gap-8 lg:gap-0">
      <div className="lg:mr-auto flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="text-lg">
            Made with <b className="dark:text-[#f38ba8] text-[#d20f39]">&lt;3</b>
          </div>
          <p className="lg:flex hidden">
            Thanks for reading.
          </p>
        </div>
        <p className="text-sm text-[#6c6f85] dark:text-[#a6adc8] lg:flex hidden">
          © 2023-present Mehmet Kutay Bozkurt. All Rights Reserved.
        </p>
      </div>
      <div className="lg:ml-auto flex flex-row gap-16">
        <div className="flex flex-col gap-6">
          <p className="text-[#6c6f85] dark:text-[#a6adc8] text-sm">
            Connections
          </p>
          <div className="flex flex-col gap-3">
            {siteConfig.footerItems.connections.map((item) => (
              <Link
                key={item.link}
                href={item.link}
                className="hover:text-[#1e66f5] hover:dark:text-[#89b4fa] hover:underline"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <p className="text-[#6c6f85] dark:text-[#a6adc8] text-sm">
            Blog
          </p>
          <div className="flex flex-col gap-3">
            {siteConfig.footerItems.blog.map((item) => (
              <Link
                key={item.link}
                href={item.link}
                className="hover:text-[#1e66f5] hover:dark:text-[#89b4fa] hover:underline"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <p className="text-sm text-[#6c6f85] dark:text-[#a6adc8] lg:hidden flex">
        © 2023-present Mehmet Kutay Bozkurt. All Rights Reserved.
      </p>
    </footer>
  );
}