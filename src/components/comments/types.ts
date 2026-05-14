import type { CommentData } from "@/config/types";

export type CommentAddProps = {
  action: "add";
  newComment: CommentData;
};

export type CommentDeleteProps = {
  action: "delete";
  commentId: number;
};

export type CommentActionProps = CommentAddProps | CommentDeleteProps;
