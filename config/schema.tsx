import { z } from 'zod';

import { guestbookColors } from '@/config/site';

export const guestbookDialogFormSchema = z.object({
  color: z.enum(guestbookColors, {
    required_error: 'A colour is required.',
  }),
  username: z.string().min(1, {
    message: 'Username must be at least 1 character.',
  }).max(30, {
    message: 'Username must be at most 30 characters.',
  }),
  message: z.string().min(1, {
    message: 'Message must be at least 1 character.'
  }).max(500, {
    message: 'Message must be at most 500 characters.'
  }),
});

export const guestbookFormSchema = z.object({
  message: z.string().min(1, {
    message: 'Message must be at least 1 character.'
  }).max(500, {
    message: 'Message must be at most 500 characters.'
  }),
});

export const commentsFormSchema = z.object({
  message: z.string().min(1, {
    message: 'Comment must be at least 1 character.'
  }).max(1000, {
    message: 'Comment must be at most 1000 characters.'
  }),
});

export const addAdminFormSchema = z.object({
  email: z.string().email({
    message: 'Must be a valid email.'
  }),
  name: z.string().min(0, {
    message: 'Name must be at least 1 character.'
  }).max(30, {
    message: 'Name must be at most 30 characters.'
  }),
});