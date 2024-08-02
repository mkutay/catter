import { z } from 'zod';

import { guestbookColorsValue } from '@/config/site';

export const guestbookDialogFormSchema = z.object({
  color: z.enum(guestbookColorsValue, {
    required_error: 'A colour is required.',
  }),
  username: z.string().min(1, {
    message: 'Username must be at least 1 character.',
  }).max(30, {
    message: 'Username must be at most 30 characters.',
  }),
  message: z.string().min(1, {
    message: 'Message must be at least 1 characters.'
  }).max(500, {
    message: 'Message must be at most 500 characters.'
  }),
});

export const guestbookFormSchema = z.object({
  message: z.string().min(1, {
    message: 'Message must be at least 1 characters.'
  }).max(500, {
    message: 'Message must be at most 500 characters.'
  }),
});

export const commentsFormSchema = z.object({
  message: z.string().min(1, {
    message: 'Comment must be at least 1 characters.'
  }).max(1000, {
    message: 'Comment must be at most 1000 characters.'
  }),
});

export const deleteGuestbookEntryFormSchema = z.object({
  items: z.array(z.number()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one item.',
  }),
});