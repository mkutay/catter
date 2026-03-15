import { desc, eq, sum } from "drizzle-orm";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import type { DatabaseError } from "@/lib/database-errors";
import { db } from "@/lib/db/drizzle";
import { views } from "@/lib/db/schema";

interface GetViewsCountError {
  message: string;
  code: "LIMIT_OUT_OF_RANGE" | "DATABASE_ERROR";
}

export const getBlogViews = () =>
  ResultAsync.fromPromise(
    db.select({ count: sum(views.count) }).from(views),
    () =>
      ({
        message: "Failed to fetch blog views. Database error.",
        code: "DATABASE_ERROR",
      }) as DatabaseError,
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
      }) as DatabaseError,
  ).andThen((viewsList) =>
    viewsList.length === 0 || !viewsList[0] || viewsList[0].count === null
      ? okAsync(0)
      : okAsync(viewsList[0].count),
  );
