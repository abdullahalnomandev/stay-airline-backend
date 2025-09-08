import { z } from 'zod';

const createUserZodSchema = z.object({
  image: z.string({ required_error: 'Government issued certificate is required' }),
  name: z.string({ required_error: 'Name is required' }),
  airlinePersonVerification: z.string().optional(),
  contact: z.string().optional(),
  email: z.string({ required_error: 'Email is required' }),
  password: z.string({ required_error: 'Password is required' }),
  address: z.string({ required_error: 'Location is required' }),
});

const updateUserZodSchema = z.object({
  name: z.string().optional(),
  contact: z.string().optional(),
  email: z.string().optional(),
  password: z.string().optional(),
  location: z.string().optional(),
  image: z.string().optional(),
});

export const UserValidation = {
  createUserZodSchema,
  updateUserZodSchema,
};