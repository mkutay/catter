import { sql } from "drizzle-orm";
import { ResultAsync } from "neverthrow";
import { siteConfig } from "@/config/site";
import type { ViewCount } from "@/config/types";
import { getSession } from "@/lib/database-queries/auth";
import { getViewCount } from "@/lib/database-queries/views";
import { db } from "@/lib/db/drizzle";
import { views } from "@/lib/db/schema";

export const incrementViews = ({ slug }: { slug: string }) =>
  getSession().andThen((session) =>
    process.env.NODE_ENV === "development" ||
    (session?.user && siteConfig.admins.includes(session.user.email as string))
      ? getViewCount({ slug })
      : insertIntoViews(slug).map((view) => view[0].count),
  );

const insertIntoViews = (slug: string) =>
  ResultAsync.fromPromise(
    db
      .insert(views)
      .values({ slug, count: 1 })
      .onConflictDoUpdate({
        target: views.slug,
        set: { count: sql`${views.count} + 1` },
      })
      .returning(),
    () => ({
      message: "Failed to increment views. Database error.",
      code: "DATABASE_ERROR" as const,
    }),
  );
