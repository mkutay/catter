import { Mailbox } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { TotalBlogViews } from "./totalBlogViews";
import { TypographyHr } from "./typography/blockquote";

export default function DoublePane({
  children,
  side,
  sideGap = "gap-12",
}: Readonly<{
  children: React.ReactNode;
  side?: React.ReactNode;
  sideGap?: string;
}>) {
  return (
    <section
      className={cn(
        "w-full mx-auto lg:max-w-6xl md:mb-12 mb-6",
        side ? "flex flex-row" : "",
        side ? sideGap : "",
      )}
    >
      <div
        className={cn(
          "w-full space-y-4 max-w-prose lg:mx-0 mx-auto px-4",
          side ? "lg:py-2" : "",
        )}
      >
        <div>{children}</div>
        <TypographyHr className="my-12" />
        <div className="flex flex-row justify-between items-center gap-4">
          <TotalBlogViews />
          <EmailSubButton />
        </div>
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
