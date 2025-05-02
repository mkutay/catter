import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { auth } from "@/lib/auth";

interface AuthError {
  message: string;
  code: "AUTH_ERROR" | "UNAUTHORISED";
}

export const getAuth = () => 
  ResultAsync.fromPromise(
    auth(),
    () => ({
      message: 'Failed to get auth session.',
      code: 'AUTH_ERROR',
    } as AuthError)
  )
  .andThen((session) =>
    session
      ? okAsync(session)
      : errAsync({
          message: 'Session not found.',
          code: 'UNAUTHORISED',
        } as AuthError)
  );