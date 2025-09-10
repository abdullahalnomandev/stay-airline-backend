import { z } from 'zod';
const createReviewZodSchema = z.object({
  body: z.object({
    hotel: z.string().optional(),
    content: z.string({ required_error: 'Review content is required' }),
    rating: z.number({
      required_error: 'Rating is required'
    }).min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
    isVisible: z.boolean().default(true)
  })
});

const updateReviewZodSchema = z.object({
  body: z.object({
    content: z.string().optional(),
    rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5').optional(),
    isVisible: z.boolean().optional()
  })
});

export const ReviewValidation = {
  createReviewZodSchema,
  updateReviewZodSchema,
};