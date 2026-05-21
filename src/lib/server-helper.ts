"use server";

import { resultAsyncToActionResult } from "./action-result";
import { deleteComment, saveComment } from "./database-actions/comments";
import {
  deleteGuestbookEntries,
  saveGuestbookEntryData,
} from "./database-actions/guestbook";
import { updateKeyValue } from "./database-actions/key-values";
import { getSession } from "./database-queries/auth";

/**
 * Retrieves the current session.
 *
 * @see {@link getSession}
 */
export const getSessionAction = async () =>
  resultAsyncToActionResult(getSession());

/**
 * Saves a comment.
 *
 * @see {@link saveComment}
 */
export const saveCommentAction = async (
  props: Parameters<typeof saveComment>[0],
) => resultAsyncToActionResult(saveComment(props));

/**
 * Deletes a comment.
 *
 * @see {@link deleteComment}
 */
export const deleteCommentAction = async (
  props: Parameters<typeof deleteComment>[0],
) => resultAsyncToActionResult(deleteComment(props));

/**
 * Saves a guestbook entry.
 *
 * @see {@link saveGuestbookEntryData}
 */
export const saveGuestbookEntryAction = async (
  props: Parameters<typeof saveGuestbookEntryData>[0],
) => resultAsyncToActionResult(saveGuestbookEntryData(props));

/**
 * Deletes guestbook entries.
 *
 * @see {@link deleteGuestbookEntries}
 */
export const deleteGuestbookEntriesAction = async (
  props: Parameters<typeof deleteGuestbookEntries>[0],
) => resultAsyncToActionResult(deleteGuestbookEntries(props));

/**
 * Updates a homepage key-value entry.
 *
 * @see {@link updateKeyValue}
 */
export const updateKeyValueAction = async (
  props: Parameters<typeof updateKeyValue>[0],
) => resultAsyncToActionResult(updateKeyValue(props));
