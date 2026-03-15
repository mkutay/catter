/**
 * Shared error types for all database query and action modules.
 */

export interface DatabaseError {
  message: string;
  code: "DATABASE_ERROR";
}

export interface AuthError {
  message: string;
  code: "AUTH_ERROR" | "UNAUTHORISED";
}
