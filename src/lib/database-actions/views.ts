import { sql } from "drizzle-orm";
import { okAsync, ResultAsync } from "neverthrow";
import type { Session } from "next-auth";
import { siteConfig } from "@/config/site";
import type { DatabaseError } from "@/config/types";
import { env } from "@/env";
import { getSession } from "@/lib/database-queries/auth";
import { db } from "@/lib/db/drizzle";
import { views } from "@/lib/db/schema";

/**
 * Checks if the user is an admin based on their session.
 *
 * @param session The user's session.
 * @returns `true` if the user is an admin, `false` otherwise.
 */
const isAdmin = (session?: Session | null | undefined): boolean => {
  const email = session?.user?.email;

  return typeof email === "string" && siteConfig.admins.includes(email);
};

/**
 * Increments the view count for a given slug, unless the user is an
 * admin or in development mode.
 *
 * @param slug The slug of the post to increment views for.
 * @returns A `ResultAsync` that resolves to `void` if successful,
 *  or a `DatabaseError` if an error occurs.
 */
export const incrementViews = ({ slug }: { slug: string }) =>
  getSession().andThen((session) =>
    env.NODE_ENV === "development" ||
    env.NODE_ENV === "test" ||
    isAdmin(session)
      ? okAsync()
      : insertIntoViews(slug),
  );

/**
 * Directly inserts a new view record or increments the existing view count for a slug.
 *
 * @param slug The slug of the post to update views for.
 * @returns A `ResultAsync` that resolves to `void` if successful,
 * or a `DatabaseError` if the database operation fails.
 */
const insertIntoViews = (slug: string) =>
  ResultAsync.fromPromise(
    db
      .insert(views)
      .values({ slug, count: 1 })
      .onConflictDoUpdate({
        target: views.slug,
        set: { count: sql`coalesce(${views.count}, 0) + 1` },
      })
      .returning(),
    () =>
      ({
        message: "Failed to increment views.",
        code: "DATABASE_ERROR",
      }) as DatabaseError,
  ).andThen(() => okAsync());
