import { z } from 'zod';

export const authValidation = {
  login: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
  register: z.object({
    fullname: z.string().min(3, 'Name is required'),
    email: z.string().email(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.string().refine((val) => ['ADMIN', 'MENTOR', 'STUDENT'].includes(val), {
      message: 'Role is invalid. Please choose a valid role.',
    }),
  }),
};

export type RegisterUser = z.infer<typeof authValidation.register>;
export type LoginUser = z.infer<typeof authValidation.login>;
