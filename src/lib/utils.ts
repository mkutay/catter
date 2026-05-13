import { type ClassValue, clsx } from "clsx";
import { err, ok, type Result } from "neverthrow";
import { twMerge } from "tailwind-merge";
import type { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SchemaValidationError {
  message: string;
  code: "INVALID_VALUES";
}

/**
 * Parses the schema and validates the values against it.
 *
 * @param schema The schema to validate against.
 * @param values The values to validate against the schema.
 * @template O The type of the schema object.
 * @returns A `Result` object indicating success or failure.
 */
export const parseSchema = <O extends object>(
  schema: z.ZodType<O>,
  values: O,
): Result<void, SchemaValidationError> => {
  const validation = schema.safeParse(values);
  return validation.success
    ? ok()
    : err({
        message: `Invalid values for schema: ${validation.error.message}`,
        code: "INVALID_VALUES",
      });
};

/**
 * Converts a string to a human-readable format.
 *
 * @param str The string to convert.
 * @returns The human-readable string.
 * @note Can be used for converting tag strings, posts' shortened values,
 * or other human-readable strings.
 */
export const humanReadable = (str: string): string =>
  str
    .replace(/-/g, " ")
    .toLowerCase()
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
