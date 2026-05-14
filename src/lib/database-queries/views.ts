import { desc, eq, sum } from "drizzle-orm";
import { errAsync, ResultAsync, safeTry } from "neverthrow";
import type { DatabaseError } from "@/config/types";
import { db } from "@/lib/db/drizzle";
import { views } from "@/lib/db/schema";

interface GetViewsCountError {
  message: string;
  code: "LIMIT_OUT_OF_RANGE" | "DATABASE_ERROR";
}

/**
 * Fetches the total number of views across all blog posts.
 *
 * @returns A `ResultAsync` that resolves to the total number of views as a number,
 * or a `DatabaseError` if the query fails.
 */
export const getBlogViews = () =>
  ResultAsync.fromPromise(
    db.select({ count: sum(views.count) }).from(views),
    () =>
      ({
        message: "Failed to fetch blog views. Database error.",
        code: "DATABASE_ERROR",
      }) as DatabaseError,
  ).map((res) => Number(res[0]?.count ?? 0));

/**
 * Fetches the view counts for a specified number of posts, ordered by view count descending.
 *
 * @param postNum The number of posts to fetch (must be between 1 and 100).
 * @returns A `ResultAsync` that resolves to an array of objects containing the slug and count,
 * or a `GetViewsCountError` if the limit is out of range or a database error occurs.
 */
export const getViewsCount = ({ postNum }: { postNum: number }) =>
  safeTry(async function* () {
    if (postNum < 1 || postNum > 100) {
      return errAsync({
        message: "Limit out of allowed range.",
        code: "LIMIT_OUT_OF_RANGE",
      } as GetViewsCountError);
    }

    return ResultAsync.fromPromise(
      db
        .select({ slug: views.slug, count: views.count })
        .from(views)
        .orderBy(desc(views.count))
        .limit(postNum),
      () =>
        ({
          message: "Failed to fetch views count. Database error.",
          code: "DATABASE_ERROR",
        }) as GetViewsCountError,
    );
  });

/**
 * Fetches the view count for a single post identified by its slug.
 *
 * @param slug The slug of the post to fetch the view count for.
 * @returns A `ResultAsync` that resolves to the view count as a number,
 * or a `DatabaseError` if the query fails.
 */
export const getViewCount = ({ slug }: { slug: string }) =>
  ResultAsync.fromPromise(
    db
      .select({ slug: views.slug, count: views.count })
      .from(views)
      .where(eq(views.slug, slug)),
    () =>
      ({
        message: "Failed to fetch view count. Database error.",
        code: "DATABASE_ERROR",
      }) as DatabaseError,
  ).map((viewsList) => viewsList[0]?.count ?? 0);
