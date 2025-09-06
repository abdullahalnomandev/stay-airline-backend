import { z } from 'zod';

const createAirlinePersonZodSchema = z.object({
  userId: z.string({ required_error: 'User ID is required' }),
  planId: z.string({ required_error: 'Plan ID is required' }),
  designation: z.string({ required_error: 'Designation is required' }),
  employeeId: z.string({ required_error: 'Employee ID is required' }),
  image: z.string({ required_error: 'Image is required' }),
  paymentStatus: z.enum(['pending', 'cancelled', 'paid'], {
    required_error: 'Payment status is required',
  }),
  paymentMethod: z.literal('card', {
    required_error: 'Payment method is required and must be card',
  }),
});

const updateAirlinePersonZodSchema = z.object({
  name: z.string().optional(),
  contact: z.string().optional(),
  email: z.string().optional(),
  password: z.string().optional(),
  location: z.string().optional(),
  image: z.string().optional(),
});

export const AirlinePersonVerification = {
  createAirlinePersonZodSchema,
};