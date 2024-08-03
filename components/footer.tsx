import Link from 'next/link';

import { siteConfig } from '@/config/site';

export default function Footer() {
  return (
    <footer className="items-center lg:items-center px-4 my-12 flex lg:flex-row flex-col max-w-prose lg:max-w-6xl mx-auto gap-8">
      <div className="grow flex flex-col justify-between lg:h-44">
        <div className="flex flex-col items-center lg:items-start gap-4">
          <p className="text-lg">
            Made with <b className="text-secondary">&lt;3</b>
          </p>
          <p>
            Thanks for reading.
          </p>
        </div>
        <p className="text-sm text-description lg:flex hidden">
          {`© 2023-present ${siteConfig.author}. All Rights Reserved.`}
        </p>
      </div>
      <div className="flex flex-row gap-16 h-fit">
        <div className="flex flex-col gap-6">
          <p className="text-description text-sm">
            Connections
          </p>
          <div className="flex flex-col gap-3">
            {siteConfig.footerItems.connections.map((item) => (
              <Link
                key={item.link}
                href={item.link}
                className="hover:text-link hover:underline"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <p className="text-description text-sm">
            Blog
          </p>
          <div className="flex flex-col gap-3">
            {siteConfig.footerItems.blog.map((item) => (
              <Link
                key={item.link}
                href={item.link}
                className="hover:text-link hover:underline"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <p className="text-sm text-description lg:hidden flex text-center justify-center">
        {`© 2023-present ${siteConfig.author}. All Rights Reserved.`}
      </p>
    </footer>
  );
}