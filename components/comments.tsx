import { MDXRemote } from 'next-mdx-remote/rsc';
import { format } from 'date-fns';
import { unstable_cache } from 'next/cache';

import { Label } from '@/components/ui/label';
import { DeleteComment, SignIn } from '@/components/commentsButtons';
import { CommentForm } from '@/components/commentForm';
import { auth } from '@/lib/auth';
import { getComments } from '@/lib/dataBaseQueries';
import { commentMeta, siteConfig } from '@/config/site';

const getCachedComments = unstable_cache(
  async ({ slug }: { slug: string }) => getComments({ slug }),
  [`nextjs-blog-comments`],
  {
    revalidate: 300, // 5 minutes
  }
);

export default async function Comments({ slug }: { slug: string }) {
  const session = await auth();
  const comments: commentMeta[] = await getCachedComments({ slug });

  return (
    <div id="comments" className="w-full flex flex-col gap-8 mt-6">
      {session?.user ? (
        <CommentForm slug={slug}/>
      ) : (
        <CommentAuth slug={slug}/>
      )}
      <div className="flex flex-col gap-6">
        {comments.map((comment) => (
          <Comment comment={comment} key={comment.id}/>
        ))}
      </div>
    </div>
  );
}

export function CommentAuth({ slug }: { slug: string }) {
  return (
    <div className="flex flex-col gap-2">
      <Label>Sign in to Write a Comment:</Label>
      <SignIn slug={slug}/>
    </div>
  );
}

export async function Comment({ comment }: { comment: commentMeta }) {
  const session = await auth();
  
  const admin = session && session.user && siteConfig.comments.siteAdmins.includes(session.user?.email as string);
  const isUsers = session && session.user && session.user.email == comment.email;

  return (
    <div id={comment.id} className="flex flex-col gap-2 w-full">
      <Label htmlFor="user">{`${comment.created_by} on ${format(comment.created_at, 'PP')}`}</Label>
      <div className="border border-border shadow-sm rounded-md px-3 py-2">
        <MDXRemote source={comment.body}/>
      </div>
      {admin || isUsers && (
        <div className="flex flex-row justify-end">
          <DeleteComment comment={comment}/>
        </div>
      )}
    </div>
  );
}