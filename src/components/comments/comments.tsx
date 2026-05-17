import { format } from "date-fns";
import { cacheTag } from "next/cache";
import { Suspense } from "react";
import { DeleteComment } from "@/components/comments/delete";
import { CommentForm } from "@/components/comments/form";
import { TypographySmall } from "@/components/typography/paragraph";
import { Label } from "@/components/ui/label";
import { siteConfig } from "@/config/site";
import { getSession } from "@/lib/database-queries/auth";
import { getComments } from "@/lib/database-queries/comments";
import { SignIn } from "../auth-buttons";
import { TypographyHr } from "../typography/blockquote";

/**
 * The main Comments component that handles fetching, displaying,
 * and managing comments for a given post slug.
 */
export async function Comments({ slug }: { slug: string }) {
  "use cache";
  cacheTag(`comments:${slug}`);
  const result = await getComments({ slug });
  if (result.isErr()) return null;
  const comments = result.value;

  return (
    <>
      <TypographyHr className="my-12" />
      <div id="comments" className="w-full flex flex-col gap-8">
        <Suspense fallback={null}>
          <CommentsAuth slug={slug} />
        </Suspense>

        {comments.length !== 0 && (
          <div className="flex flex-col gap-8">
            {comments.map((comment) => (
              <div
                id={comment.id.toString()}
                className="flex flex-col gap-2 w-full"
                key={comment.id}
              >
                <Label>{`${comment.createdBy} on ${format(comment.createdAt, "PP")}`}</Label>
                <div className="border border-border shadow-xs rounded-md px-3 py-2">
                  {comment.body}
                </div>

                {/* Show delete button if the current user owns the comment or is an admin. */}
                {/*{((sessionEmail && siteConfig.admins.includes(sessionEmail)) ||
                  sessionEmail === comment.email) && (
                  <div className="flex flex-row justify-end">
                    <DeleteComment comment={comment} />
                  </div>
                )}*/}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

async function CommentsAuth({ slug }: { slug: string }) {
  const session = await getSession().unwrapOr(null);
  return session ? (
    <CommentForm slug={slug} />
  ) : (
    <div className="flex flex-col gap-2">
      <SignIn callbackUrl={`/posts/${slug}#comments`} />
      <TypographySmall className="font-sans">
        Sign in to write a comment!
      </TypographySmall>
    </div>
  );
}

export function CommentsSkeleton() {
  return null;
}
