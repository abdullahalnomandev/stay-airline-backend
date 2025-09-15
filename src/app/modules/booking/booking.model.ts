import { model, Schema } from 'mongoose';
import { BOOKING_PAYMENT_METHOD, BOOKING_STATUS, bookingPaymentMethod, bookingStatus, PAYMENT_STATUS, paymentStatus } from './booking.constant';
import { IBooking, IBookingModel } from './booking.interface';

const bookingSchema = new Schema<IBooking, IBookingModel>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        hotelId: {
            type: Schema.Types.ObjectId,
            ref: 'Hotel',
            required: true,
        },
        bookingId:{
            type:String,
            require:true
        },
        checkInDate: {
            type: Date,
            required: true,
        },
        checkOutDate: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: bookingStatus,
            default: BOOKING_STATUS.PENDING,
        },
        paymentMethod: {
            type: String,
            enum: bookingPaymentMethod,
            default: BOOKING_PAYMENT_METHOD.CARD,
        },
        paymentStatus: {
            type: String,
            enum: paymentStatus,
            default: PAYMENT_STATUS.PENDING,
        }
    },
    { timestamps: true }
);

export const Booking = model<IBooking, IBookingModel>('Booking', bookingSchema);
