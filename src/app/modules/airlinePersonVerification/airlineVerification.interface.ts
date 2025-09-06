import { Model, Types } from "mongoose";
import { IUser } from "../user/user.interface";
import { IVerificationPlan } from "../verificationPlan/verificaitonPlan.interface";
export type IairlinePersonVerification = {
    userId: Types.ObjectId | IUser;
    planId: Types.ObjectId | IVerificationPlan;
    designation: string;
    employeeId: string;
    images: string[];
    paymentStatus: 'pending' | 'cancelled' | 'paid';
    paymentMethod: 'card';
}

export type IairlinePersonVerificationModel = Model<IairlinePersonVerification, Record<string, unknown>>