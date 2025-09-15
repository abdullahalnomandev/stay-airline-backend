import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { BookingService } from './booking.service';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constant/pagination';

// Create a new booking
const createBooking = catchAsync(async (req: Request, res: Response) => {
    const bookingData = req.body;
    const userId = req.user?.id;
    const email = req.user?.email;
    const origin = `${req.protocol}://${req.get('host')}`;
    const result = await BookingService.createBooking(origin, { userId, ...bookingData });

    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: 'Booking created successfully',
        data: result
    });
});

/// cancel booking
const cancelBooking = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.query?.userId as string;
    const status = req.query?.status as 'success' | 'cancel';
    const result = await BookingService.cencelBooking(res, id, status, userId);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Booking cancelled successfully',
        data: result
    });
});

//Get all bookings with filtering, pagination, and searching
const getMyBooking = catchAsync(async (req: Request, res: Response) => {
    // const filters = pick(req.query, ['userId', 'hotelId', 'checkInDate', 'checkOutDate', 'status', 'paymentMethod', 'paymentStatus']);
    // const paginationOptions = pick(req.query, ['page', 'limit', 'sort']);
    const userId = req.user?.id;

    const result = await BookingService.getMyBooking(req.query, userId);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Bookings retrieved successfully',
        data: result
    });
});

const getALlHostBookings = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;

    const result = await BookingService.getALlHostBookings(req.query, userId);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Bookings retrieved successfully',
        data: result
    });
});

const getALlHostBookingsByAdmin = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;

    const patinationOptions = pick(req.query, paginationFields);
    const result = await BookingService.getALlHostBookingsByAdmin(req.query, patinationOptions);
    // const result = await BookingService.getALlHostBookingsByAdmin(req.query, userId);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Bookings retrieved successfully',
        data: result
    });
});

const updateBooking = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const bookingId = req.params.id;
    const booking = req.body;
    const result = await BookingService.updateBooking(bookingId, booking, user);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Bookings updated successfully',
        data: result
    });
});

export const BookingController = {
    createBooking,
    getMyBooking,
    cancelBooking,
    getALlHostBookings,
    getALlHostBookingsByAdmin,
    updateBooking
};