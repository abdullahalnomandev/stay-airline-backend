import { z } from 'zod';

const createContactCategoryZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required'
    }).trim()
  })
});

const updateContactCategoryZodSchema = z.object({
  body: z.object({
    title: z.string().trim().optional()
  })
});

export const ContactCategoryValidation = {
  createContactCategoryZodSchema,
  updateContactCategoryZodSchema,
};