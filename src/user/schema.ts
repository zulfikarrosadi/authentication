import { z } from 'zod';

export const createUserSchema = z
  .object({
    username: z.string().min(1, 'username is required'),
    password: z.string().min(1, 'password is required'),
    passwordConfirmation: z
      .string({ required_error: 'password confirmation is required' })
      .min(1, 'password confirmation is required'),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'password and password confirmation is not match',
    path: ['password'],
  });
