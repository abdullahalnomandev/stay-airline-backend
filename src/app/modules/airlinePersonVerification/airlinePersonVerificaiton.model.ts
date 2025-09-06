import { model, Schema } from 'mongoose';
import { IairlinePersonVerification, IairlinePersonVerificationModel } from './airlineVerification.interface';

const airlinePersonVerificationSchema = new Schema<IairlinePersonVerification, IairlinePersonVerificationModel>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        designation: {
            type: String,
            required: true,
        },
        employeeId: {
            type: String,
            required: true,
        },
        images: {
            type: [String],
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'cancelled', 'paid'],
            default:'pending',
            required: true,
        },
        paymentMethod: {
            type: String,
            enum: ['card'],
            required: true,
            default: 'card',
        }
    },
    { timestamps: true }
);

export const AirlinePersonVerification = model<IairlinePersonVerification, IairlinePersonVerificationModel>('AirlinePersonVerification', airlinePersonVerificationSchema);