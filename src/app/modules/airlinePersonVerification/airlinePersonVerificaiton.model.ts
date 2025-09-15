import { model, Schema } from 'mongoose';
import { IairlinePersonVerification, IairlinePersonVerificationModel } from './airlineVerification.interface';

const airlinePersonVerificationSchema = new Schema<IairlinePersonVerification, IairlinePersonVerificationModel>(
    {
        // user: {
        //     type: Schema.Types.ObjectId,
        //     ref: 'User',
        //     required: true
        // },
        plan: {
            type: Schema.Types.ObjectId,
            ref: 'VerificationPlan',
            required: true,
        },
        designation: {
            type: String,
            required: false,
        },
        employeeId: {
            type: String,
            required: false,
        },
        email: {
            type: String,
            required: false,
        },
        images: {
            type: [String],
            required: false,
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'cancelled', 'paid'],
            default: 'pending',
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