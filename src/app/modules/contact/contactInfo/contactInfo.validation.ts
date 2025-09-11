import { z } from 'zod';
const createContactInfoZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required'
    }).trim(),
    phone: z.string({
      required_error: 'Phone number is required'
    }).trim(),
    website: z.string({
      required_error: 'Website is required'
    }).trim(),
    contactCategory: z.string({
      required_error: 'Contact category is required'
    })
  })
});

const updateContactInfoZodSchema = z.object({
  body: z.object({
    name: z.string().trim().optional(),
    phone: z.string().trim().optional(),
    website: z.string().trim().optional(),
    contactCategory: z.string().optional()
  })
});

export const ContactInfoValidation = {
  createContactInfoZodSchema,
  updateContactInfoZodSchema,
};