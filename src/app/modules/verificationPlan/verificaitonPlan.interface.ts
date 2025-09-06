import { Model } from "mongoose";

export type IVerificationPlan = {
    title: string;
    price: number;
    billingCycle: 'one-time' | 'annual' | 'yearly';
    description: string;
    features: string[];
    ctaLabel?: string;
    active: boolean;
}

export type IVerificationPlanModel = Model<IVerificationPlan, Record<string, unknown>>
