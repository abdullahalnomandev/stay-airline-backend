import { model, Schema } from 'mongoose';
import { IVerificationPlan, IVerificationPlanModel } from './verificaitonPlan.interface';

const verificationPlanSchema = new Schema<IVerificationPlan, IVerificationPlanModel>(
    {
        title: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        billingCycle: {
            type: String,
            enum: ['one-time', 'annual', 'add-on'],
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        features: {
            type: [String],
            required: true,
        },
        ctaLabel: {
            type: String,
            required: false,
        },
        active: {
            type: Boolean,
            required: true,
            default: true,
        },
    },
    { timestamps: true }
);

export const VerificationPlan = model<IVerificationPlan, IVerificationPlanModel>('VerificationPlan', verificationPlanSchema);