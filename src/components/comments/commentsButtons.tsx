"use client";

import { signIn, signOut } from "next-auth/react";
import { useState } from "react";
import { FaDiscord, FaGithub, FaSpotify } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import type { CommentData } from "@/config/types";
import { deleteCommentAction } from "@/lib/server-helper";

export function SignOut({ slug }: { slug: string }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="default"
      onClick={() => signOut({ callbackUrl: `/posts/${slug}#comments` })}
    >
      Sign Out
    </Button>
  );
}

export function SignIn({ slug }: { slug: string }) {
  return (
    <div className="flex flex-row gap-2 items-center w-full">
      <Button
        variant="secondary"
        size="sm"
        className="flex flex-row gap-2 items-center flex-1"
        onClick={() =>
          signIn("github", { callbackUrl: `/posts/${slug}#comments` })
        }
      >
        <FaGithub className="size-4" />
        GitHub
      </Button>
      <Button
        variant="secondary"
        size="sm"
        className="flex flex-row gap-2 items-center flex-1"
        onClick={() =>
          signIn("discord", { callbackUrl: `/posts/${slug}#comments` })
        }
      >
        <FaDiscord className="size-4" />
        Discord
      </Button>
      <Button
        variant="secondary"
        size="sm"
        className="flex flex-row gap-2 items-center flex-1"
        onClick={() =>
          signIn("spotify", { callbackUrl: `/posts/${slug}#comments` })
        }
      >
        <FaSpotify className="size-4" />
        Spotify
      </Button>
    </div>
  );
}

export function DeleteComment({
  comment,
  editComment,
}: {
  comment: CommentData;
  editComment?: (
    props:
      | {
          action: "add";
          newComment: CommentData;
        }
      | {
          action: "delete";
          commentId: number;
        },
  ) => void;
}) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setOpen(false);

    if (editComment) {
      editComment({ action: "delete", commentId: comment.id });
    }

    const result = await deleteCommentAction({ id: comment.id });

    if (!result.ok) {
      toast({
        title: "Error",
        description: `Error deleting comment. ${result.error.message}`,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button id={comment.id.toString()} variant="destructive" size="sm">
          Delete Comment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you absolutely sure you want to delete this comment?
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            comment.
          </DialogDescription>
        </DialogHeader>
        <div className="border border-border shadow-xs rounded-md px-3 py-2">
          {comment.body}
        </div>
        <DialogFooter>
          <Button
            type="submit"
            variant="destructive"
            size="sm"
            onClick={handleDelete}
          >
            Delete Comment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
