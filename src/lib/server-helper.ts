"use server";

import { resultAsyncToActionResult } from "./action-result";
import { auth } from "./auth";
import { deleteComment, saveComment } from "./database-actions/comments";
import {
  deleteGuestbookEntries,
  saveGuestbookEntryData,
} from "./database-actions/guestbook";
import { incrementViews } from "./database-actions/views";
import { getComments } from "./database-queries/comments";
import { getBlogViews, getViewCount } from "./database-queries/views";

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

export const saveCommentAction = async (props: {
  slug: string;
  message: string;
}) => resultAsyncToActionResult(saveComment(props));

export const deleteCommentAction = async (props: { id: number }) =>
  resultAsyncToActionResult(deleteComment(props));

export const getCommentsAction = async (props: { slug: string }) =>
  resultAsyncToActionResult(getComments(props));

export const getViewCountAction = async (props: { slug: string }) =>
  resultAsyncToActionResult(getViewCount(props));

export const incrementViewsAction = async (props: { slug: string }) =>
  resultAsyncToActionResult(incrementViews(props));

export const getBlogViewsAction = async () =>
  resultAsyncToActionResult(getBlogViews());

export const saveGuestbookEntryAction = async (props: {
  color?: string;
  username?: string;
  message: string;
}) => resultAsyncToActionResult(saveGuestbookEntryData(props));

export const deleteGuestbookEntriesAction = async (props: {
  entries: number[];
}) => resultAsyncToActionResult(deleteGuestbookEntries(props));
