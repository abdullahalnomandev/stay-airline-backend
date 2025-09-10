import { z } from 'zod';

const createLegalDocumentZodSchema = z.object({
  title: z.string({ required_error: 'Title is required' }),
  slug: z.string({ required_error: 'Slug is required' }),
  content: z.string({ required_error: 'Content is required' }),
});

const updateLegalDocumentZodSchema = z.object({
  title: z.string().optional(),
  slug: z.string().optional(),
  content: z.string().optional(),
});

export const LegalDocumentValidation = {
  createLegalDocumentZodSchema,
  updateLegalDocumentZodSchema,
};