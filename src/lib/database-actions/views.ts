import { sql } from "drizzle-orm";
import { okAsync, ResultAsync } from "neverthrow";
import type { DatabaseError } from "@/config/types";
import { env } from "@/env";
import { db } from "@/lib/db/drizzle";
import { views } from "@/lib/db/schema";

/**
 * Increments the view count for a given slug, unless in development
 * or test mode.
 *
 * @param slug The slug of the post to increment views for.
 * @returns A `ResultAsync` that resolves to `void` if successful,
 *  or a `DatabaseError` if an error occurs.
 */
export const incrementViews = ({ slug }: { slug: string }) =>
  env.NODE_ENV === "development" || env.NODE_ENV === "test"
    ? okAsync()
    : insertIntoViews(slug);

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
