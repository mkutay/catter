"use server";

import { deleteGuestbookEntries, saveGuestbookEntryData } from "./database-actions/guestbook";
import { deleteComment, saveComment } from "./database-actions/comments";
import { getBlogViews, getViewCount } from "./database-queries/views";
import { resultAsyncToActionResult } from "./action-result";
import { getComments } from "./database-queries/comments";
import { incrementViews } from "./database-actions/views";
import { CommentData } from "@/config/types";
import { auth } from "./auth";

export async function getUser() {
  const session = await auth();
  if (!session || !session.user || !session.user.email || !session.user.name) {
    return null;
  }
  return {
    email: session.user.email,
    name: session.user.name,
  };
}

export const saveCommentAction = async (props: { slug: string, message: string }) =>
  resultAsyncToActionResult(
    saveComment(props)
  );

export const deleteCommentAction = async (props: { comment: CommentData }) => 
  resultAsyncToActionResult(
    deleteComment(props)
  );

export const getCommentsAction = async (props: { slug: string }) =>
  resultAsyncToActionResult(getComments(props));

export const getViewCountAction = async (props: { slug: string }) =>
  resultAsyncToActionResult(getViewCount(props));

export const incrementViewsAction = async (props: { slug: string }) =>
  resultAsyncToActionResult(incrementViews(props));

export const getBlogViewsAction = async () =>
  resultAsyncToActionResult(getBlogViews());

export const saveGuestbookEntryAction = async (props: { color?: string, username?: string, message: string }) =>
  resultAsyncToActionResult(saveGuestbookEntryData(props));

export const deleteGuestbookEntriesAction = async (props: { entries: number[] }) =>
  resultAsyncToActionResult(deleteGuestbookEntries(props));