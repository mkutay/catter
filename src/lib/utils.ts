import { type ClassValue, clsx } from 'clsx';
import { err, ok, Result } from "neverthrow";
import { twMerge } from 'tailwind-merge';
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SchemaValidationError {
  message: string;
  code: "INVALID_VALUES";
};

export const parseSchema = <O extends object>(schema: z.ZodSchema<O>, values: O): 
  Result<void, SchemaValidationError> => {
  const validation = schema.safeParse(values);
  return validation.success
    ? ok()
    : err({
        message: "Invalid values for schema: " + validation.error.message,
        code: "INVALID_VALUES",
      });
}