import { ArrowRight, Mailbox } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { TypographyHr } from "./typography/blockquote";
import { cn } from "@/lib/utils";

export default function DoublePane({
  children,
  hideFollowLink,
  side,
  sideGap = "gap-12",
}: Readonly<{
  children: React.ReactNode;
  hideFollowLink?: boolean;
  side?: React.ReactNode;
  sideGap?: string;
}>) {
  if (!side) {
    return (
      <section className="w-full mx-auto lg:max-w-6xl md:mb-12 mb-6">
        <div className="w-full space-y-4 max-w-prose lg:mx-0 mx-auto px-4">
          <div>{children}</div>
          <TypographyHr className="my-4" />
          {!hideFollowLink ? (
            <div className="justify-between items-center gap-4 flex flex-row flex-wrap">
              <EmailSubButton />
              <FollowNext />
            </div>
          ) : (
            <div className="flex flex-row justify-end items-center">
              <EmailSubButton />
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section
      className={cn(
        "w-full mx-auto lg:max-w-6xl md:mb-12 mb-6 flex flex-row",
        sideGap,
      )}
    >
      <div className="w-full space-y-4 max-w-prose lg:mx-0 mx-auto px-4 lg:py-2">
        <div>{children}</div>
        <TypographyHr className="my-4" />
        {!hideFollowLink ? (
          <div className="justify-between items-center gap-4 flex flex-row flex-wrap">
            <EmailSubButton />
            <FollowNext />
          </div>
        ) : (
          <div className="flex flex-row justify-end items-center">
            <EmailSubButton />
          </div>
        )}
      </div>
      {side}
    </section>
  );
}

function EmailSubButton() {
  return (
    <div className="flex flex-col gap-4">
      {/* <p className="text-lg leading-7 not-first:mt-6">
        Subscribe to my newsletter to get updates on new posts and email only specials.
      </p> */}
      <Button variant="secondary" size="lg" className="flex mx-auto" asChild>
        <Link
          href={siteConfig.newsletterSubscribe}
          className="flex flex-row gap-3 w-fit font-normal tracking-wide"
        >
          <Mailbox stroke="currentColor" strokeWidth="1.6px" />
          <div>Subscribe!</div>
        </Link>
      </Button>
    </div>
  );
}

function FollowNext() {
  return (
    <div className="text-primary group pl-0 hover:pl-2 transition-all animate-in flex flex-row items-center grow justify-end">
      <div className="pr-4 group-hover:pr-2 transition-all animate-in">
        <ArrowRight
          stroke="currentColor"
          strokeWidth="2px"
          width="18px"
          height="18px"
        />
      </div>
      <Link
        href="/follow-next"
        className="text-xl font-normal italic tracking-wider uppercase text-right w-fit whitespace-nowrap"
      >
        Follow Next!
      </Link>
    </div>
  );
}
