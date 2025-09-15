import { z } from 'zod';

const createAirlinePersonZodSchema = z.object({
  user: z.string({ required_error: 'User ID is required' }),
  plan: z.string({ required_error: 'Plan ID is required' }),
  designation: z.string().optional(),
  employeeId: z.string().optional(),
  paymentStatus: z.enum(['pending', 'cancelled', 'paid'], {
    required_error: 'Payment status is required',
  }).default('pending'),
  paymentMethod: z.enum(['card'], {
    required_error: 'Payment method is required and must be card',
  }).default('card'),
});

const updateAirlinePersonZodSchema = z.object({
  designation: z.string().optional(),
  employeeId: z.string().optional(),
  images: z.array(z.string()).optional(),
  paymentStatus: z.enum(['pending', 'cancelled', 'paid']).optional(),
  paymentMethod: z.enum(['card']).optional(),
});

export const AirlinePersonVerification = {
  createAirlinePersonZodSchema,
  updateAirlinePersonZodSchema,
};