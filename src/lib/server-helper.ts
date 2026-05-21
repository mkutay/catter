"use server";

import type { ResultAsync } from "neverthrow";
import { resultAsyncToActionResult } from "./action-result";
import { deleteComment, saveComment } from "./database-actions/comments";
import {
  deleteGuestbookEntries,
  saveGuestbookEntryData,
} from "./database-actions/guestbook";
import { updateKeyValue } from "./database-actions/key-values";
import { getSession } from "./database-queries/auth";

const asAction =
  <Args extends unknown[], R extends ResultAsync<unknown, unknown>>(
    fn: (...args: Args) => R,
  ) =>
  async (...args: Args) =>
    resultAsyncToActionResult(fn(...args));

/**
 * Retrieves the current session.
 *
 * @see {@link getSession}
 */
export const getSessionAction = asAction(getSession);

/**
 * Saves a comment.
 *
 * @see {@link saveComment}
 */
export const saveCommentAction = asAction(saveComment);

/**
 * Deletes a comment.
 *
 * @see {@link deleteComment}
 */
export const deleteCommentAction = asAction(deleteComment);

/**
 * Saves a guestbook entry.
 *
 * @see {@link saveGuestbookEntryData}
 */
export const saveGuestbookEntryAction = asAction(saveGuestbookEntryData);

/**
 * Deletes guestbook entries.
 *
 * @see {@link deleteGuestbookEntries}
 */
export const deleteGuestbookEntriesAction = asAction(deleteGuestbookEntries);

/**
 * Updates a homepage key-value entry.
 *
 * @see {@link updateKeyValue}
 */
export const updateKeyValueAction = asAction(updateKeyValue);
