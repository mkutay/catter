import Link from 'next/link';

import { siteConfig } from '@/config/site';

export default function Footer() {
  return (
    <footer className="items-center lg:items-center lg:px-8 px-4 my-12 flex lg:flex-row flex-col max-w-prose lg:max-w-6xl mx-auto gap-8">
      <div className="grow flex flex-col justify-between lg:h-44">
        <div className="flex flex-col items-center lg:items-start gap-4">
          <p className="text-lg">
            Made with <b className="text-red">&lt;3</b>
          </p>
          <p>
            Thanks for reading.
          </p>
        </div>
        <p className="text-sm text-subtext-0 lg:flex hidden">
          © 2023-present Mehmet Kutay Bozkurt. All Rights Reserved.
        </p>
      </div>
      <div className="flex flex-row gap-16 h-fit">
        <div className="flex flex-col gap-6">
          <p className="text-subtext-0 text-sm">
            Connections
          </p>
          <div className="flex flex-col gap-3">
            {siteConfig.footerItems.connections.map((item) => (
              <Link
                key={item.link}
                href={item.link}
                className="hover:text-blue hover:underline"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <p className="text-subtext-0 text-sm">
            Blog
          </p>
          <div className="flex flex-col gap-3">
            {siteConfig.footerItems.blog.map((item) => (
              <Link
                key={item.link}
                href={item.link}
                className="hover:text-blue hover:underline"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <p className="text-sm text-subtext-0 lg:hidden flex text-center justify-center">
        © 2023-present Mehmet Kutay Bozkurt. All Rights Reserved.
      </p>
    </footer>
  );
}