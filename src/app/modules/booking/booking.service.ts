import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import QueryBuilder from "../../builder/QueryBuilder";
import { IBooking } from "./booking.interface";
import { Booking } from "./booking.model";
import { Hotel } from "../hotel/hotel.model";
import { BOOKING_STATUS, PAYMENT_STATUS } from "./booking.constant";
import mongoose from "mongoose";
import Stripe from "stripe";
import config from "../../../config";
import { User } from "../user/user.model";
import { Response } from "express";
import stripe from "../../../config/stripe";

// const createBooking = async (
//     rootUrl: string,
//     booking: IBooking
// ): Promise<{ redirectPaymentUrl: string }> => {
//     const session = await mongoose.startSession();
//     let useTransaction = false;
//     // const stripe = new Stripe(config.stripe.secret_key as string, {
//     //     apiVersion: '2025-08-27.basil',
//     //     typescript: true,
//     // });
//     try {
//         // Check if MongoDB supports transactions
//         const mongoInfo = await mongoose.connection.db.admin().serverStatus();
//         if (mongoInfo.repl && mongoInfo.repl.setName) {
//             useTransaction = true;
//             session.startTransaction();
//         }

//         // Check if hotel exists
//         const hotelExist = await Hotel.findById(booking.hotelId).session(session);
//         if (!hotelExist) {
//             throw new ApiError(StatusCodes.NOT_FOUND, 'Hotel not found');
//         }

//         // Check if the dates are valid
//         if (booking.checkInDate >= booking.checkOutDate) {
//             throw new ApiError(StatusCodes.BAD_REQUEST, 'Check-in date must be before check-out date');
//         }
//         const user = await User.findById(booking.userId).lean();
//         const hostOfHoel = await User.findById(hotelExist.hostId);

//         // Create booking record
//         const bookingRecords = await Booking.create([booking], { session });
//         const bookingRecord = bookingRecords[0];
//         console.log({ user: user?.connectedAccountId })

//         // Create Stripe checkout session
//         const checkoutSession = await stripe.checkout.sessions.create({
//             payment_method_types: ["card"], // required
//             mode: "payment",
//             customer_email: user?.email as string,
//             line_items: [
//                 {
//                     price_data: {
//                         currency: "usd",
//                         product_data: {
//                             name: hotelExist.name as string,
//                             description: hotelExist.description as string,
//                             // images: hotelExist.image && [`${rootUrl}/${hotelExist.image[0]}`],
//                         },
//                         unit_amount: hotelExist.roomPrice
//                             ? Math.round(hotelExist.roomPrice * 100)
//                             : 0,
//                     },
//                     quantity: 1,
//                 },
//             ],
//             metadata: {
//                 bookingId: bookingRecord._id.toString(),
//             },
//             payment_intent_data: {
//                 application_fee_amount: Math.round(hotelExist.roomPrice * 0.1 * 100),
//                 transfer_data: {
//                     destination: hostOfHoel?.connectedAccountId as string, // must be a valid acct_xxx
//                 },
//             },
//             success_url: `${rootUrl}/api/v1/booking/webhook/${bookingRecord._id}?status=success&userId=${user?._id}`,
//             cancel_url: `${rootUrl}/api/v1/booking/webhook/${bookingRecord._id}?status=cancel&userId=${user?._id}`,
//         });


//         if (useTransaction) await session.commitTransaction();
//         session.endSession();

//         return { redirectPaymentUrl: checkoutSession.url as string };
//     } catch (error) {
//         if (useTransaction) await session.abortTransaction();
//         session.endSession();
//         throw error;
//     }
// };

export const createBooking = async (
    rootUrl: string,
    booking: IBooking
): Promise<{ redirectPaymentUrl: string }> => {
    const session = await mongoose.startSession();
    let useTransaction = false;

    try {
        // Check if MongoDB supports transactions
        const mongoInfo = await mongoose.connection.db.admin().serverStatus();
        if (mongoInfo.repl && mongoInfo.repl.setName) {
            useTransaction = true;
            session.startTransaction();
        }

        // Check if hotel exists
        const hotel = await Hotel.findById(booking.hotelId).session(session);
        if (!hotel) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Hotel not found");
        }

        // Validate dates
        if (booking.checkInDate >= booking.checkOutDate) {
            throw new ApiError(
                StatusCodes.BAD_REQUEST,
                "Check-in date must be before check-out date"
            );
        }

        // Guest (the user making booking)
        const guest = await User.findById(booking.userId).lean();
        if (!guest) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Guest user not found");
        }

        // Host (owner of hotel)
        const host = await User.findById(hotel.hostId);
        if (!host) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Host user not found");
        }
        console.log({host})

        // Prevent host from booking their own hotel
        // if (booking.userId.toString() === hotel.hostId.toString()) {
        //     throw new ApiError(
        //         StatusCodes.BAD_REQUEST,
        //         "Host cannot book their own hotel"
        //     );
        // }

        // Create booking record
        const [bookingRecord] = await Booking.create([booking], { session });

        // Create Stripe Checkout session
        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            customer_email: guest.email,
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: hotel.name as string,
                            description: hotel.description as string,
                            images:
                                hotel.image && hotel.image.length > 0
                                    ? [`${rootUrl}/${hotel.image[0]}`]
                                    : [],
                        },
                        unit_amount: hotel.roomPrice
                            ? Math.round(hotel.roomPrice * 100)
                            : 0,
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                bookingId: bookingRecord._id.toString(),
            },
            payment_intent_data: {
                application_fee_amount: Math.round(hotel.roomPrice * 0.1 * 100), // 10% fee
                transfer_data: {
                    destination: host.connectedAccountId as string, // must be acct_xxx
                },
            },
            success_url: `${rootUrl}/api/v1/booking/webhook/${bookingRecord._id}?status=success&userId=${guest._id}`,
            cancel_url: `${rootUrl}/api/v1/booking/webhook/${bookingRecord._id}?status=cancel&userId=${guest._id}`,
        });

        // Commit transaction if used
        if (useTransaction) await session.commitTransaction();
        session.endSession();

        return { redirectPaymentUrl: checkoutSession.url as string };
    } catch (error) {
        if (useTransaction) await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

const cencelBooking = async (res: Response, bookingId: string, status: 'success' | 'cancel', userId: string) => {
    const session = await mongoose.startSession();
    let useTransaction = false;
    try {
        // Check if MongoDB supports transactions
        const mongoInfo = await mongoose.connection.db.admin().serverStatus();
        if (mongoInfo.repl && mongoInfo.repl.setName) {
            useTransaction = true;
            session.startTransaction();
        }
        // Check if booking exists
        const bookingExist = await Booking.findById(bookingId).session(session);
        if (!bookingExist) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Booking not found');
        }

        if (status === 'success') {
            await Booking.findByIdAndUpdate(
                bookingId,
                { paymentStatus: PAYMENT_STATUS.PAID },
                { session }
            );

            if (useTransaction) await session.commitTransaction();
            session.endSession();

            return res.redirect(`${config.frontend_url}/payment-success`);
        }

        if (status === 'cancel') {
            await Booking.findByIdAndDelete(bookingId).session(session);

            if (useTransaction) await session.commitTransaction();
            session.endSession();

            return res.redirect(`${config.frontend_url}/payment-cancel`);
        }
    } catch (error) {
        if (useTransaction) await session.abortTransaction();
        session.endSession();
        throw error;
    }
};


const getMyBooking = async (query: Record<string, unknown>, userId: string) => {

    query.userId = userId;

    const bookingQuery = new QueryBuilder(Booking.find(), query)
        .paginate()
        // .search(bookingSearchableFields)
        .filter()
        .sort();

    const result = await bookingQuery.modelQuery.populate({
        path: 'hotelId',
        select: '-facilities -roomClosureDates -hotelRules -coordinates'
    }).lean();

    const pagination = await bookingQuery.getPaginationInfo();

    // Rename the populated field
    const renamedResult = result.map(booking => ({
        ...booking,
        hotel: booking.hotelId,
        hotelId: undefined
    }));

    return {
        pagination,
        result: renamedResult
    };
};

const getALlHostBookings = async (query: Record<string, unknown>, userId: string) => {
    const hostHotels = await Hotel.find({ hostId: userId }).lean();
    const hostHotelIds = hostHotels.map(hotel => hotel._id);

    query.hotelId = { $in: hostHotelIds };

    const bookingQuery = new QueryBuilder(Booking.find(), query)
        .paginate()
        .filter()
        .sort()
        .fields()

    const result = await bookingQuery.modelQuery
        .populate({
            path: 'hotelId',
            select: 'name roomPrice '
        })
        .populate({
            path: 'userId',
            select: 'name email contact address '
        }).lean();

    const pagination = await bookingQuery.getPaginationInfo();

    // Rename the populated fields
    const renamedResult = result.map(booking => ({
        ...booking,
        hotel: booking.hotelId,
        user: booking.userId,
        hotelId: undefined,
        userId: undefined
    }));

    return {
        pagination,
        result: renamedResult
    };
};

export const BookingService = {
    createBooking,
    getMyBooking,
    cencelBooking,
    getALlHostBookings
};