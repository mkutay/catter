import { Mailbox } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { TotalBlogViews } from "./total-blog-views";
import { TypographyHr } from "./typography/blockquote";

/**
 * A double pane layout component that displays a main content area
 * and an optional side panel.
 *
 * @param children The main content area.
 * @param side The optional side panel, if provided, otherwise still
 *  limits the width of the main content area.
 * @param sideGap The gap between the main content and the side panel.
 */
export function DoublePane({
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
          <Button variant="secondary" size="lg" asChild>
            <Link
              href={siteConfig.newsletterSubscribe}
              className="flex flex-row gap-3"
            >
              <Mailbox stroke="currentColor" strokeWidth="1.6px" />
              <div>Subscribe!</div>
            </Link>
          </Button>
        </div>
      </div>
      {side}
    </section>
  );
}
