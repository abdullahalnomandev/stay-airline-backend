import { z } from 'zod';
import { HOTEL_STATUS, ROOM_TYPE } from './hotel.constant';
const createHotelZodSchema = z.object({
  hostId: z.string({ required_error: 'Host ID is required' }),
  name: z.string({ required_error: 'Hotel name is required' }),
  status: z.enum([HOTEL_STATUS.DRAFT, HOTEL_STATUS.ACTIVE, HOTEL_STATUS.INACTIVE], {
    required_error: 'Status is required',
  }),
  roomPrice: z.number({ required_error: 'Room price is required' }),
  description: z.string({ required_error: 'Description is required' }),
  roomType: z.enum([ROOM_TYPE.SINGLE, ROOM_TYPE.DOUBLE], {
    required_error: 'Room type is required',
  }),
  address: z.string({required_error:"Address is required"}),
  // address: z.object({
  //   street: z.string({ required_error: 'Street address is required' }),
  //   city: z.string({ required_error: 'City is required' }),
  //   country: z.string({ required_error: 'Country is required' }),
  //   zip: z.string({ required_error: 'ZIP code is required' }),
  // }),
  coordinates: z.array(z.number()).length(2),
  image: z.array(z.string()).optional(),
  facilities: z.array(z.string()).optional(),
  roomClosureDates: z.array(z.date()).optional(),
  hotelRules: z
    .array(
      z.object({
        title: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .optional(),
  utilityBill: z.string().optional(),
});

const updateHotelZodSchema = z.object({
  name: z.string().optional(),
  roomPrice: z.number().optional(),
  description: z.string().optional(),
  status: z.enum([HOTEL_STATUS.DRAFT, HOTEL_STATUS.ACTIVE, HOTEL_STATUS.INACTIVE]).optional(),
  roomType: z.enum([ROOM_TYPE.SINGLE, ROOM_TYPE.DOUBLE]).optional(),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      country: z.string().optional(),
      zip: z.string().optional(),
    })
    .optional(),
  coordinates: z.array(z.number()).length(2).optional(),
  image: z.array(z.string()).optional(),
  facilities: z.array(z.string()).optional(),
  roomClosureDates: z.array(z.date()).optional(),
  hotelRules: z
    .array(
      z.object({
        title: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .optional(),
  utilityBill: z.array(z.string()).optional(),
});

export const HotelValidation = {
  createHotelZodSchema,
  updateHotelZodSchema,
};