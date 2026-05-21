import { z } from "zod";

import { guestbookColors } from "@/config/types";

export const guestbookDialogFormSchema = z.object({
  color: z.enum(guestbookColors, {
    error: (issue) =>
      issue.input === undefined ? "A colour is required." : undefined,
  }),
  username: z
    .string()
    .min(1, {
      error: "Username must be at least 1 character.",
    })
    .max(30, {
      error: "Username must be at most 30 characters.",
    }),
  message: z
    .string()
    .min(1, {
      error: "Message must be at least 1 characters.",
    })
    .max(500, {
      error: "Message must be at most 500 characters.",
    }),
});

export const guestbookFormSchema = z.object({
  message: z
    .string()
    .min(1, {
      error: "Message must be at least 1 characters.",
    })
    .max(500, {
      error: "Message must be at most 500 characters.",
    }),
});

export const commentsFormSchema = z.object({
  message: z
    .string()
    .min(1, {
      error: "Comment must be at least 1 characters.",
    })
    .max(1000, {
      error: "Comment must be at most 1000 characters.",
    }),
});

export const deleteGuestbookEntryDataFormSchema = z.object({
  items: z.array(z.number()).refine((value) => value.some((item) => item), {
    error: "You have to select at least one item.",
  }),
});

export const updateKeyValueFormSchema = z.object({
  value: z.string().min(1, {
    error: "A slug is required.",
  }),
});
