"use client";

import { useState } from "react";
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

/**
 * Button component that opens a confirmation dialog to delete a comment.
 */
export function DeleteComment({ comment }: { comment: CommentData }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setOpen(false);
    const result = await deleteCommentAction({ id: comment.id });

    if (!result.ok) {
      toast({
        title: "Error",
        description: `Error deleting comment. ${result.error.message}`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Comment deleted successfully.",
        variant: "default",
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
