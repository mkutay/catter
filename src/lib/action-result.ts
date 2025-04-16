/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { err, ok, Result, ResultAsync } from "neverthrow";

// These are needed for the `createAction()` method to work.
// neverthrow results can not be sent over the wire in server actions.

export type ActionResult<T, E> = ActionOk<T, E> | ActionErr<T, E>;

export type ActionOk<T, E> = {
  ok: true;
  value: T;
};
export const actionOk = <T>(value: T): ActionOk<T, never> => ({
  ok: true,
  value,
});

export type ActionErr<T, E> = {
  ok: false;
  error: E;
};
export const actionErr = <E>(error: E): ActionErr<never, E> => ({
  ok: false,
  error,
});

/**
 * Converts a `ResultAsync<T,E>` to a `<ActionResult<T,E>`.
 */
export type ResultAsyncToActionResult<T> = [T] extends [
  ResultAsync<infer D, infer E>,
]
  ? ActionResult<D, E>
  : never;

export type ActionResultToResult<T> = [T] extends [
  ActionResult<infer D, infer E>,
]
  ? Result<D, E>
  : never;

/**
 * Converts an `ActionResult<T,E>` to a `Result<T,E>`.
 */
export const actionResultToResult = <
  R extends ActionResult<any, any>,
  T = R extends ActionResult<infer T, any> ? T : never,
  E = R extends ActionResult<any, infer E> ? E : never,
>(
  actionResult: R,
): Result<T, E> => {
  if (actionResult.ok) {
    return ok(actionResult.value);
  }
  return err(actionResult.error);
};

/**
 * Converts a `ResultAsync<T,E>` to an `ActionResult<T,E>` by awaiting the ResultAsync.
 */
export const resultAsyncToActionResult = async <
  R extends ResultAsync<any, any>,
  T = R extends ResultAsync<infer T, any> ? T : never,
  E = R extends ResultAsync<any, infer E> ? E : never,
>(
  resultAsync: R,
): Promise<ActionResult<T, E>> => {
  const result = await resultAsync;
  if (result.isOk()) {
    return actionOk(result.value);
  }
  return actionErr(result.error);
};