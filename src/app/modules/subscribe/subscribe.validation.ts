import { z } from 'zod';

const createSubscribeZodSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

export const SubscribeValidation = {
  createSubscribeZodSchema,
};