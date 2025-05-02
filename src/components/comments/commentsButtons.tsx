'use client';

import { FaDiscord, FaGithub, FaSpotify } from 'react-icons/fa';
import { signIn, signOut } from 'next-auth/react';
import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { CommentData } from '@/config/types';
import Server from '@/lib/server';

export function SignOut({ slug }: { slug: string }) {
  return (
    <Button type="button" variant="ghost" size="default" onClick={() => signOut({ callbackUrl: `/posts/${slug}#comments` })}>
      Sign Out
    </Button>
  );
}

export function SignIn({ slug }: { slug: string }) {
  return (
    <div className="flex flex-row gap-2 items-center mx-auto w-fit">
      <Button variant="secondary" size="default" className="flex flex-row gap-2 items-center" onClick={() => signIn('github', { callbackUrl: `/posts/${slug}#comments` })}>
        <FaGithub/>
        <span>
          GitHub
        </span>
      </Button>
      <Button variant="secondary" size="default" className="flex flex-row gap-2 items-center" onClick={() => signIn('discord', { callbackUrl: `/posts/${slug}#comments` })}>
        <FaDiscord/>
        <span>
          Discord
        </span>
      </Button>
      <Button variant="secondary" size="default" className="flex flex-row gap-2 items-center" onClick={() => signIn('spotify', { callbackUrl: `/posts/${slug}#comments` })}>
        <FaSpotify/>
        <span>
          Spotify
        </span>
      </Button>
    </div>
  );
}

export function DeleteComment({ 
  comment, 
  editComment,
}: { 
  comment: CommentData;
  editComment?: (props: {
    action: "add";
    newComment: CommentData;
  } | {
    action: "delete";
    commentId: string;
  }) => void;
}) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setOpen(false);
    
    if (editComment) {
      editComment({ action: 'delete', commentId: comment.id });
    }
    
    const result = await Server.Comments.Delete({ comment });
    
    if (!result.ok) {
      toast({
        title: 'Error',
        description: 'Error deleting comment.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button id={comment.id} variant="destructive" size="sm">
          Delete Comment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely you want to delete the comment?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the comment.
          </DialogDescription>
        </DialogHeader>
        <div className="border border-border shadow-sm rounded-md px-3 py-2">
          {comment.body}
        </div>
        <DialogFooter>
          <Button type="submit" variant="destructive" size="sm" onClick={handleDelete}>
            Delete Comment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}