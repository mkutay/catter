import { desc, eq, sum } from "drizzle-orm";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import type { ViewCount } from "@/config/types";
import { db } from "@/lib/db/drizzle";
import { views } from "@/lib/db/schema";

interface GetViewsCountError {
  message: string;
  code: "LIMIT_OUT_OF_RANGE" | "DATABASE_ERROR";
}

interface GetBlogViewsError {
  message: string;
  code: "DATABASE_ERROR";
}

interface GetViewCountError {
  message: string;
  code: "POST_NOT_FOUND" | "DATABASE_ERROR" | "NO_VIEWS_FOUND";
}

export const getBlogViews = () =>
  ResultAsync.fromPromise(
    db.select({ count: sum(views.count) }).from(views),
    () =>
      ({
        message: "Failed to fetch blog views. Database error.",
        code: "DATABASE_ERROR",
      }) as GetBlogViewsError,
  ).map((views) => {
    return views.reduce((acc, curr) => acc + Number(curr.count), 0);
  });

export const getViewsCount = ({ postNum }: { postNum: number }) =>
  postNum < 1 || postNum > 100
    ? errAsync({
        message: "Limit out of allowed range.",
        code: "LIMIT_OUT_OF_RANGE",
      } as GetViewsCountError)
    : ResultAsync.fromPromise(
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
      }) as GetViewCountError,
  ).andThen((views) =>
    views.length === 0 || !views[0]
      ? errAsync({
          message: "No views found for this post.",
          code: "NO_VIEWS_FOUND",
        } as GetViewCountError)
      : okAsync(views[0].count),
  );
