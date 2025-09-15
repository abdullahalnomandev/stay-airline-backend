import { Model, Types } from "mongoose";
import { IUser } from "../user/user.interface";
import { IVerificationPlan } from "../verificationPlan/verificaitonPlan.interface";
export type IairlinePersonVerification = {
    // user: Types.ObjectId | IUser;
    plan: Types.ObjectId | IVerificationPlan;
    email?:string;
    designation?: string;
    employeeId?: string;
    images?: string[];
    paymentStatus: 'pending' | 'cancelled' | 'paid';
    paymentMethod: 'card';
}

export type IairlinePersonVerificationModel = Model<IairlinePersonVerification, Record<string, unknown>>