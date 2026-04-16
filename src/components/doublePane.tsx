import { Mailbox } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { TypographyHr } from "./typography/blockquote";

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
          <TypographyHr className="my-12" />
          {!hideFollowLink ? (
            <div className="justify-between items-center gap-4 flex flex-row flex-wrap">
              <EmailSubButton />
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
        <TypographyHr className="my-12" />
        {!hideFollowLink ? (
          <div className="justify-between items-center gap-4 flex flex-row flex-wrap">
            <EmailSubButton />
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
