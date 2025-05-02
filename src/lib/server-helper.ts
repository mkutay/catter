"use server";

import { deleteGuestbookEntries, saveGuestbookEntryData } from "./database-actions/guestbook";
import { deleteComment, saveComment } from "./database-actions/comments";
import { resultAsyncToActionResult } from "./action-result";
import { getComments } from "./database-queries/comments";
import { incrementViews } from "./database-actions/views";
import { getBlogViews, getViewCount } from "./database-queries/views";
import { CommentData } from "@/config/types";
import { auth } from "./auth";

export async function getEmail() {
  const session = await auth();
  if (!session || !session.user || !session.user.email) {
    return null;
  }
  return session.user.email;
}

export async function saveCommentAction(props: { slug: string, message: string }) {
  return resultAsyncToActionResult(saveComment(props));
}

export async function deleteCommentAction(props: { comment: CommentData }) {
  return resultAsyncToActionResult(deleteComment(props));
}

export async function getCommentsAction(props: { slug: string }) {
  return resultAsyncToActionResult(getComments(props));
}

export async function getViewCountAction(props: { slug: string }) {
  return resultAsyncToActionResult(getViewCount(props));
}

export async function incrementViewsAction(props: { slug: string }) {
  return resultAsyncToActionResult(incrementViews(props));
}

export async function getBlogViewsAction() {
  return resultAsyncToActionResult(getBlogViews());
}

export async function saveGuestbookEntryAction(props: { color?: string, username?: string, message: string }) {
  return resultAsyncToActionResult(saveGuestbookEntryData(props));
}

export async function deleteGuestbookEntriesAction(props: { entries: number[] }) {
  return resultAsyncToActionResult(deleteGuestbookEntries(props));
}