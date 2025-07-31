import { z } from 'zod';

export const authValidation = {
  login: z.object({
    email: z.email().nonempty('Email is required'),
    password: z.string().nonempty('Password is required'),
  }),
  register: z.object({
    fullname: z.string().nonempty('Name is required').min(3, 'Name is required'),
    email: z.email().nonempty('Email is required'),
    password: z.string().nonempty('Password is required').min(6, 'Password must be at least 6 characters'),
    role: z.string().refine((val) => ['ADMIN', 'MENTOR', 'STUDENT'].includes(val), {
      message: 'Role is invalid. Please choose a valid role.',
    }),
  }),
};

export type RegisterUser = z.infer<typeof authValidation.register>;
export type LoginUser = z.infer<typeof authValidation.login>;
