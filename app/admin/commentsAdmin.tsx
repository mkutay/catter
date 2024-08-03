import Link from 'next/link';

import { Comment } from '@/components/comments/comments';
import { commentMeta } from '@/config/site';
import { getProps } from '@/lib/contentQueries';

export function CommentsAdmin({ comments }: { comments: commentMeta[] }) {
  const commentsWithSlug: {
    slug: string,
    comments: commentMeta[],
  }[] = [];

  comments.forEach((comment) => {
    let indexCommentsWithSlug = -1;
    
    commentsWithSlug.forEach((commentWithSlug, index) => {
      if (comment.slug == commentWithSlug.slug) {
        indexCommentsWithSlug = index;
        return;
      }
    });

    if (indexCommentsWithSlug == -1) {
      commentsWithSlug.push({
        slug: comment.slug,
        comments: [comment],
      });
    } else {
      commentsWithSlug[indexCommentsWithSlug].comments.push(comment);
    }
  });

  return (
    <div className="flex flex-col">
      {commentsWithSlug.map((comments) => (
        <div key={comments.slug}>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-4 mb-2">
            <Link href={`/posts/${comments.slug}`} className="underline hover:text-foreground/80 transition-all">
              {getProps('content/posts', comments.slug).meta.title}
            </Link>
          </h3>
          {comments.comments.map((comment) => (
            <div key={comment.id}>
              <Comment comment={comment}/>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}