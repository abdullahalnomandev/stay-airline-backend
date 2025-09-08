import { z } from 'zod';
import { bookingPaymentMethod, bookingStatus, paymentStatus } from './booking.constant';

const createBookingZodSchema = z.object({
    body: z.object({
        hotelId: z.string({
            required_error: 'Hotel ID is required',
        }),
        status: z.enum([...bookingStatus] as [string, ...string[]], {
            required_error: 'Status is required',
        }).optional(),
        paymentMethod: z.enum([...bookingPaymentMethod] as [string, ...string[]], {
            required_error: 'Payment method is required',
        }).optional(),
        paymentStatus: z.enum([...paymentStatus] as [string, ...string[]], {
            required_error: 'Payment status is required',
        }).optional(),
    }),
});

const updateBookingZodSchema = z.object({
    body: z.object({
        userId: z.string().optional(),
        hotelId: z.string().optional(),
        checkInDate: z.string()
            .refine((val) => !isNaN(Date.parse(val)), {
                message: 'Invalid check-in date format',
            })
            .optional(),
        checkOutDate: z.string()
            .refine((val) => !isNaN(Date.parse(val)), {
                message: 'Invalid check-out date format',
            })
            .optional(),
        status: z.enum([...bookingStatus] as [string, ...string[]]).optional(),
        paymentMethod: z.enum([...bookingPaymentMethod] as [string, ...string[]]).optional(),
        paymentStatus: z.enum([...paymentStatus] as [string, ...string[]]).optional(),
    }),
});

export const BookingValidation = {
    createBookingZodSchema,
    updateBookingZodSchema,
};