import type { Metadata } from "next";
import { Suspense } from "react";
import DoublePane from "@/components/doublePane";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/config/site";
import type { EntryData } from "@/config/types";
import { auth } from "@/lib/auth";
import { getGuestbookEntries } from "@/lib/database-queries/guestbook";
import { cn } from "@/lib/utils";
import { GuestBookSignIn } from "./buttons";
import GuestbookForm, { GuestBookFormFallback } from "./form";

export const metadata: Metadata = {
  title: "Sign and Mark My Guestbook",
  description:
    "Sign my guestbook and leave your mark on this infinite internet, here.",
  keywords: ["guestbook", "mark"],
  openGraph: {
    title: "Sign and Mark My Guestbook",
    description:
      "Sign my guestbook and leave your mark on this infinite internet, here.",
    url: `${siteConfig.url}/guestbook`,
    locale: "en_UK",
    type: "website",
    images: ["images/favicon.png"],
    siteName: siteConfig.name,
  },
};

export default function Page() {
  return (
    <DoublePane>
      <h1 className="scroll-m-20 text-3xl font-semibold tracking-wide text-primary uppercase my-6">
        Sign My Guestbook!
      </h1>
      <main className="flex flex-col gap-4">
        <Suspense fallback={<GuestBookFormFallback />}>
          <Form />
        </Suspense>
        <Suspense fallback={<GuestbookEntriesFallback />}>
          <GuestbookEntries />
        </Suspense>
      </main>
    </DoublePane>
  );
}

async function Form() {
  const session = await auth();

  return session?.user ? (
    <div className="flex flex-col gap-2">
      <GuestbookForm />
    </div>
  ) : (
    <div className="items-center justify-center flex">
      <GuestBookSignIn />
    </div>
  );
}

// text-rosewater text-flamingo text-pink text-mauve text-red text-maroon text-peach text-yellow text-green text-teal text-sky text-sapphire text-blue text-lavender
async function GuestbookEntries() {
  const entriesResult = await getGuestbookEntries();

  if (entriesResult.isErr()) {
    console.error(
      "Error in displaying guestbook entries in /guestbook:",
      entriesResult.error.message,
    );
    return (
      <div>
        <p className="font-normal leading-7 not-first:mt-6 text-destructive">
          There was an error loading the guestbook entries. Please try again
          later.
        </p>
      </div>
    );
  }

  const entries = entriesResult.value;

  return (
    <div className="flex flex-col *:py-3 *:flex *:flex-col *:gap-1 w-full wrap-break-word text-base divide-border divide-y font-sans -my-3">
      {entries.map((entry: EntryData) => (
        <p key={entry.id}>
          <span
            className={cn(
              "font-semibold font-serif",
              entry.color ? `text-${entry.color}` : "text-foreground",
            )}
          >
            {entry.createdBy}
          </span>
          {entry.body ?? (
            <span className="text-foreground tracking-tight">{entry.body}</span>
          )}
        </p>
      ))}
    </div>
  );
}

function GuestbookEntriesFallback() {
  const entries: React.ReactNode[] = [];

  for (let i = 0; i < 10; i++) {
    entries.push(
      <div key={i}>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-4/5" />
      </div>,
    );
  }

  return (
    <div className="flex flex-col *:py-3 *:flex *:flex-col *:gap-1 w-full divide-border divide-y -my-3">
      {entries}
    </div>
  );
}
