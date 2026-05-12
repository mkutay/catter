"use server";

import { resultAsyncToActionResult } from "./action-result";
import { auth } from "./auth";
import { deleteComment, saveComment } from "./database-actions/comments";
import {
  deleteGuestbookEntries,
  saveGuestbookEntryData,
} from "./database-actions/guestbook";

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

export const saveGuestbookEntryAction = async (props: {
  color?: string;
  username?: string;
  message: string;
}) => resultAsyncToActionResult(saveGuestbookEntryData(props));

export const deleteGuestbookEntriesAction = async (props: {
  entries: number[];
}) => resultAsyncToActionResult(deleteGuestbookEntries(props));
