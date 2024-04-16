import { z } from 'zod';

export const loginSchema = z.object({
  username: z
    .string({ required_error: 'username is required' })
    .min(1, 'username is required'),
  password: z
    .string({ required_error: 'password is required' })
    .min(1, 'password is required'),
});
