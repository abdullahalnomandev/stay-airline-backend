import mongoose, { Model } from "mongoose";
import { BOOKING_STATUS, BOOKING_PAYMENT_METHOD, PAYMENT_STATUS } from "./booking.constant";
import { IUser } from "../user/user.interface";
import { IHotel } from "../hotel/hotel.interface";

export type IBooking = {
    userId: mongoose.Types.ObjectId | IUser;
    hotelId: mongoose.Types.ObjectId | IHotel;
    bookingId:string;
    checkInDate: Date;
    checkOutDate: Date;
    status: BOOKING_STATUS;
    paymentMethod: BOOKING_PAYMENT_METHOD;
    paymentStatus: PAYMENT_STATUS;
}

export type IBookingModel = Model<IBooking, Record<string, unknown>>
