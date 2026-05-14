import { format } from "date-fns";
import Link from "next/link";
import { DeleteComment } from "@/components/comments/delete";
import { Label } from "@/components/ui/label";
import type { CommentData } from "@/config/types";

/**
 * Renders a list of comments grouped by their respective post slugs
 * for administrative review.
 */
export function CommentsAdmin({ comments }: { comments: CommentData[] }) {
  const groupedComments = comments.reduce(
    (acc, comment) => {
      const { slug } = comment;
      if (!acc[slug]) {
        acc[slug] = [];
      }
      acc[slug].push(comment);
      return acc;
    },
    {} as Record<string, CommentData[]>,
  );

  // Convert the grouped Record into an array of entries for mapping.
  const commentsBySlug = Object.entries(groupedComments).map(
    ([slug, comments]) => ({
      slug,
      comments,
    }),
  );

  return (
    <div className="flex flex-col">
      {commentsBySlug.map(({ slug, comments }) => (
        <div key={slug} className="mb-8">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-4 mb-2">
            <Link
              href={`/posts/${slug}`}
              className="underline hover:opacity-80 transition-opacity"
            >
              {slug}
            </Link>
          </h3>
          <div className="flex flex-col gap-4">
            {comments.map((comment) => (
              <div key={comment.id}>
                <div
                  id={comment.id.toString()}
                  className="flex flex-col gap-2 w-full"
                >
                  <Label>{`${comment.createdBy} on ${format(comment.createdAt, "PP")}`}</Label>
                  <div className="border border-border shadow-xs rounded-md px-3 py-2">
                    {comment.body}
                  </div>
                  <div className="flex flex-row justify-end">
                    <DeleteComment comment={comment} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
