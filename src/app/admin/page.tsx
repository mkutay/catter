import { okAsync, safeTry } from "neverthrow";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DoublePane } from "@/components/double-pane";
import { TypographyH1 } from "@/components/typography/headings";
import { existingKeys, siteConfig } from "@/config/site";
import { auth } from "@/lib/auth";
import { getPosts } from "@/lib/content-queries";
import { getKeyValues } from "@/lib/database-actions/key-values";
import { getEveryComment } from "@/lib/database-queries/comments";
import { getGuestbookEntries } from "@/lib/database-queries/guestbook";
import { CommentsAdmin } from "./comments";
import { GuestbookAdminForm } from "./guestbook";
import { HomePagePostsForm } from "./key-values";

export const metadata: Metadata = {
  title: "Site Admin",
  robots: {
    index: false,
    follow: false,
    nocache: false,
  },
};

/**
 * Needs admin access to view this page.
 */
export default async function Page() {
  const session = await auth();

  if (!siteConfig.admins.includes(session?.user?.email || "")) {
    redirect("/");
  }

  const result = await safeTry(async function* () {
    const entries = yield* getGuestbookEntries();
    const comments = yield* getEveryComment();
    const posts = yield* getPosts({});
    const kvs = (yield* getKeyValues(existingKeys)).sort((a, b) =>
      a.key.localeCompare(b.key),
    ) as Array<{
      key: (typeof existingKeys)[number];
      value: string;
    }>;
    return okAsync({ entries, comments, posts, kvs });
  });

  if (result.isErr())
    throw new Error(
      "Error in fetching data for admin page: " + result.error.message,
    );

  const { entries, comments, posts, kvs } = result.value;
  const slugs = posts.map((p) => p.slug);

  return (
    <DoublePane>
      <TypographyH1 className="mt-6 mb-8 text-primary">Admin</TypographyH1>
      <h2 className="scroll-m-20 border-b border-border pb-1 text-3xl font-semibold tracking-tight mt-6 mb-2">
        Home Page
      </h2>
      <div className="space-y-4">
        {existingKeys.map((key) => (
          <div key={key} className="space-y-1">
            <h3 className="text-base font-mono">{key}</h3>
            <HomePagePostsForm
              slotKey={key}
              value={kvs.find((k) => k.key === key)?.value}
              allSlugs={slugs}
            />
          </div>
        ))}
      </div>
      <h2 className="scroll-m-20 border-b border-border pb-1 text-3xl font-semibold tracking-tight mt-6 mb-2">
        Guestbook
      </h2>
      <GuestbookAdminForm entries={entries} />
      <h2 className="scroll-m-20 border-b border-border pb-1 text-3xl font-semibold tracking-tight mt-6">
        Comments
      </h2>
      <CommentsAdmin comments={comments} />
    </DoublePane>
  );
}
