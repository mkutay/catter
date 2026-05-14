import { errAsync, okAsync, ResultAsync } from "neverthrow";
import type { AuthError } from "@/config/types";
import { auth } from "@/lib/auth";

/**
 * Retrieves the authenticated session.
 *
 * @returns A `ResultAsync` containing the session or an error.
 * @note The if the session doesn't exists, it returns an error.
 */
export const getAuth = () =>
  getSession().andThen((session) =>
    session
      ? okAsync(session)
      : errAsync({
          message: "Session not found.",
          code: "UNAUTHORISED",
        } as AuthError),
  );

/**
 * Retrieves the authenticated session.
 *
 * @returns A `ResultAsync` containing the session or an error.
 * @note The session might be `null`.
 */
export const getSession = () =>
  ResultAsync.fromPromise(
    auth(),
    () =>
      ({
        message: "Failed to get auth session.",
        code: "AUTH_ERROR",
      }) as AuthError,
  );
