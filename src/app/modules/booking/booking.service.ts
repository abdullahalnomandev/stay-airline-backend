import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import QueryBuilder from "../../builder/QueryBuilder";
import { IBooking } from "./booking.interface";
import { Booking } from "./booking.model";
import { Hotel } from "../hotel/hotel.model";
import { BOOKING_STATUS, bookingSearchableFields, PAYMENT_STATUS } from "./booking.constant";
import mongoose, { FlattenMaps } from "mongoose";
import Stripe from "stripe";
import config from "../../../config";
import { User } from "../user/user.model";
import { Response } from "express";
import stripe from "../../../config/stripe";
import { generateBookingId } from "./booking.util";
import { IUser } from "../user/user.interface";
import { USER_ROLES } from "../../../enums/user";
import { JwtPayload } from "jsonwebtoken";
import { IHotel } from "../hotel/hotel.interface";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { IPaginationOptions } from "../../../types/pagination";

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

        //Generate booking id
        const bookingId = await generateBookingId();
        booking.bookingId = bookingId;

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
                            // images:
                            //     hotel.image && hotel.image.length > 0
                            //         ? [`${rootUrl}/${hotel.image[0]}`]
                            //         : [],
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


// const getALlHostBookingsByAdmin = async (query: Record<string, unknown>, userId: string) => {

//     query.paymentStatus = 'paid'

//     const bookingQuery = new QueryBuilder(Booking.find(), query)
//         .paginate()
//         .filter()
//         .sort()
//         .fields()
//         .search(bookingSearchableFields)


//     const result = await bookingQuery.modelQuery
//         .populate({
//             path: 'hotelId',
//             select: 'name roomPrice',
//             populate: {
//                 path: 'hostId',
//                 select: 'name email contact address'
//             }
//         })
//         .populate({
//             path: 'userId',
//             select: 'name email contact address '
//         }).lean();

//     const pagination = await bookingQuery.getPaginationInfo();

//     // Rename the populated fields
//     const renamedResult = result.map(booking => ({
//         ...booking,
//         hotel: {
//             ...booking.hotelId,
//             host: (booking.hotelId as FlattenMaps<IHotel>).hostId,
//             hostId: undefined
//         },
//         user: booking.userId,
//         hotelId: undefined,
//         userId: undefined
//     }));

//     return {
//         pagination,
//         result: renamedResult
//     };
// };


const getALlHostBookingsByAdmin = async (query: Record<string, any>, paginationOptions: IPaginationOptions) => {
    
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(paginationOptions);
    // Always only paid bookings
    query.paymentStatus = "paid";
  // Extract pagination details

    const searchTerm = query.searchTerm || "";

    // Build $match conditions
    const matchStage: any = {
        paymentStatus: "paid",
    };

    // If search term exists, apply regex search in hotel, host, user fields
    let searchStage = {};
    if (searchTerm) {
        searchStage = {
            $or: [
                { "bookingId": { $regex: searchTerm, $options: "i" } },
                { "hotel.name": { $regex: searchTerm, $options: "i" } },
                { "hotel.host.name": { $regex: searchTerm, $options: "i" } },
                { "user.name": { $regex: searchTerm, $options: "i" } },
                { "user.email": { $regex: searchTerm, $options: "i" } },
                { "user.contact": { $regex: searchTerm, $options: "i" } }
            ],
        };
    }

    const result = await Booking.aggregate([
        { $match: matchStage },

        // Lookup hotel
        {
            $lookup: {
                from: "hotels",
                localField: "hotelId",
                foreignField: "_id",
                as: "hotel",
            },
        },
        { $unwind: "$hotel" },

        // Lookup host inside hotel
        {
            $lookup: {
                from: "users", // host collection is same as users? adjust if different
                localField: "hotel.hostId",
                foreignField: "_id",
                as: "hotel.host",
            },
        },
        { $unwind: "$hotel.host" },

        // Lookup user
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user",
            },
        },
        { $unwind: "$user" },

        // Apply search term filter
        { $match: searchStage },

        // Project only necessary fields
        {
            $project: {
                bookingId: 1,
                paymentStatus: 1,
                createdAt: 1,
                "hotel.name": 1,
                "hotel.roomPrice": 1,
                "hotel.host.name": 1,
                "hotel.host.email": 1,
                "hotel.host.contact": 1,
                "hotel.host.address": 1,
                "user.name": 1,
                "user.email": 1,
                "user.contact": 1,
                "user.address": 1,
            },
        },

        // Sorting
        { $sort: { createdAt: -1 } },

        // Pagination
        { $skip: skip },
        { $limit: limit },
    ]);

    // Count total docs with same filters
    const total = await Booking.aggregate([
        { $match: matchStage },
        {
            $lookup: {
                from: "hotels",
                localField: "hotelId",
                foreignField: "_id",
                as: "hotel",
            },
        },
        { $unwind: "$hotel" },
        {
            $lookup: {
                from: "users",
                localField: "hotel.hostId",
                foreignField: "_id",
                as: "hotel.host",
            },
        },
        { $unwind: "$hotel.host" },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user",
            },
        },
        { $unwind: "$user" },
        { $match: searchStage },
        { $count: "total" },
    ]);

    const pagination = {
        total: total[0]?.total || 0,
        limit,
        page,
        totalPage: Math.ceil((total[0]?.total || 0) / limit),
    };

    return {
        pagination,
        result,
    };
};


const updateBooking = async (
    bookingId: string,
    booking: Partial<IBooking>,
    user: JwtPayload
): Promise<IBooking | null> => {
    const session = await mongoose.startSession();
    let useTransaction = false;

    try {
        // Detect replica set once (you can also cache this in config instead of checking every time)
        const mongoInfo = await mongoose.connection.db.admin().serverStatus();
        if (mongoInfo.repl?.setName) {
            useTransaction = true;
            session.startTransaction();
        }

        // Fetch booking with its hotel in one go (reduce extra DB hit)
        const existingBooking = await Booking.findById(bookingId).lean().session(session);

        if (!existingBooking) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Booking not found");
        }

        const hotel = await Hotel.findById(existingBooking.hotelId).lean();
        if (!hotel) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Associated hotel not found");
        }

        console.log({ userId: user.id })

        // Authorization check
        const isAuthorized =
            hotel.hostId.toString() === user.id ||
            user.role === USER_ROLES.ADMIN ||
            user.role === USER_ROLES.SUPER_ADMIN;

        console.log({ hotelId: hotel.hostId.toString(), usreId: user.id })

        if (!isAuthorized) {
            throw new ApiError(StatusCodes.FORBIDDEN, "You are not authorized to update this booking");
        }

        // Update booking directly
        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            { $set: booking },
            { new: true, session }
        ).populate({
            path: "hotelId",
            select: "-facilities -roomClosureDates -hotelRules -coordinates",
        });

        if (useTransaction) await session.commitTransaction();
        return updatedBooking;
    } catch (error) {
        if (useTransaction) await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};


export const BookingService = {
    createBooking,
    getMyBooking,
    cencelBooking,
    getALlHostBookings,
    getALlHostBookingsByAdmin,
    updateBooking
};