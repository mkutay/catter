import Link from 'next/link';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { siteConfig } from '@/config/site';

export default function Footer() {
  return (
    <footer className="bg-muted">
      <div className="items-center px-4 md:my-12 my-6 hidden md:flex flex-row max-w-6xl mx-auto gap-8">
        <div className="grow flex flex-col justify-between h-44">
          <div className="flex flex-col items-start gap-4">
            <p className="text-lg">
              Made with <b className="text-primary">&lt;3</b>
            </p>
            <p>
              Thanks for reading.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2023-present {siteConfig.author}. All Rights Reserved.
          </p>
        </div>
        <div className="flex flex-row gap-16 h-fit">
          <div className="flex flex-col gap-6">
            <p className="text-muted-foreground text-sm">
              Connections
            </p>
            <div className="flex flex-col gap-3">
              {siteConfig.footerItems.connections.map((item) => (
                <Link
                  key={item.link}
                  href={item.link}
                  className="hover:text-foreground/80 transition-all"
                  prefetch={false}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <p className="text-muted-foreground text-sm">
              Blog
            </p>
            <div className="flex flex-col gap-3">
              {siteConfig.footerItems.blog.map((item) => (
                <Link
                  key={item.link}
                  href={item.link}
                  className="hover:text-foreground/80 transition-all"
                  prefetch={false}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="items-center px-4 md:my-12 my-6 md:hidden flex flex-col w-full gap-8 max-w-lg mx-auto">
        <div className="w-full flex flex-col justify-between gap-4">
          <div className="flex flex-row items-center justify-between gap-4 flex-wrap">
            <p className="text-lg">
              Made with <b className="text-primary">&lt;3</b>
            </p>
            <p>
              Thanks for reading.
            </p>
          </div>
        </div>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1" className="border-b border-muted-foreground/20">
            <AccordionTrigger className="text-muted-foreground text-md font-normal tracking-wide">
              Connections
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-3">
              {siteConfig.footerItems.connections.map((item) => (
                <Link
                  key={item.link}
                  href={item.link}
                  className="hover:text-foreground/80 transition-all"
                  prefetch={false}
                >
                  {item.title}
                </Link>
              ))}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" className="border-none">
            <AccordionTrigger className="text-muted-foreground text-md font-normal tracking-wide">
              Blog
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-3">
              {siteConfig.footerItems.blog.map((item) => (
                <Link
                  key={item.link}
                  href={item.link}
                  className="hover:text-foreground/80 transition-all"
                  prefetch={false}
                >
                  {item.title}
                </Link>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <p className="text-sm text-muted-foreground lg:hidden flex text-center justify-center">
          {`© 2023-present ${siteConfig.author}. All Rights Reserved.`}
        </p>
      </div>
    </footer>
  );
}