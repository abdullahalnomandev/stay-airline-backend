import { Response } from "express";
import config from "../../../config";
import ApiError from "../../../errors/ApiError";
import QueryBuilder from "../../builder/QueryBuilder";
import { User } from "../user/user.model";
import { VerificationPlan } from "../verificationPlan/verificationPlan.model";
import { AirlinePersonVerification } from "./airlinePersonVerificaiton.model";
import { airlinePersonVerificationSearchableFields } from "./airlineVerification.constant";
import { IairlinePersonVerification } from "./airlineVerification.interface";
import Stripe from 'stripe';
import mongoose from "mongoose";
import { Notification } from "../notification/notification.model";

const stripe = new Stripe(config.stripe.secret_key as string, {
    apiVersion: '2025-08-27.basil',
});

const createairlinePersonVerification = async (
    rootUrl: string,
    airlinePersonVerification: IairlinePersonVerification
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

        // Check if user exists
        const userEmailExist = await User.findOne({ email: airlinePersonVerification.email }).session(session);
        if (!userEmailExist) throw new ApiError(404, 'User email not correct');
        // airlinePersonVerification.email = userExist.email;

        // Get price plan
        const pricePlan = await VerificationPlan.findById(airlinePersonVerification.plan).lean();
        if (!pricePlan) throw new ApiError(404, 'Plan id not correct');

        // Create AirlinePersonVerification record
        const verificationRecords = await AirlinePersonVerification.create(
            [airlinePersonVerification],
            { session }
        );
        const verificationRecord = verificationRecords[0];

        // Create Stripe checkout session
        const checkoutSession = await stripe.checkout.sessions.create({
            currency: 'usd',
            customer_email: userEmailExist.email as string,
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: { name: pricePlan.title as string },
                        unit_amount: pricePlan.price ? Math.round(pricePlan.price * 100) : 0,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${rootUrl}/api/v1/airline-verification/webhook/${verificationRecord._id}?status=success&userId=${userEmailExist._id}`,
            cancel_url: `${rootUrl}/api/v1/airline-verification/webhook/${verificationRecord._id}?status=cancel&userId=${userEmailExist._id}`,
        });

        if (useTransaction) await session.commitTransaction();
        session.endSession();

        return { redirectPaymentUrl: checkoutSession.url as string };
    } catch (error) {
        if (useTransaction) await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

const handleAirlinePersonVerificationRedirect = async (
    res: Response,
    status: string,
    userId: string,
    airlinePersonVerificationId: string
) => {
    const session = await mongoose.startSession();
    let useTransaction = false;

    try {
        const mongoInfo = await mongoose.connection.db.admin().serverStatus();
        if (mongoInfo.repl && mongoInfo.repl.setName) {
            useTransaction = true;
            session.startTransaction();
        }

        if (status === 'success') {
           const subscirpton =  await AirlinePersonVerification.findByIdAndUpdate(
                airlinePersonVerificationId,
                { paymentStatus: 'paid' },
                { session }
            );
            await User.updateOne(
                { _id: userId },
                { airlinePersonVerification: airlinePersonVerificationId },
                { session }
            );
            const notification = await Notification.create({
                title: "New Subscription Created",
                message: "A new subscription has been successfully created",
                path: "/verification-plan",
                refId: subscirpton?._id
            });
            (global as any).io.emit("new_notificaiton", notification)

            if (useTransaction) await session.commitTransaction();
            session.endSession();

            return res.redirect(`${config.frontend_url}/payment-success`);
        }

        if (status === 'cancel') {
            await AirlinePersonVerification.findByIdAndDelete(airlinePersonVerificationId).session(session);
            if (useTransaction) await session.commitTransaction();
            session.endSession();

            return res.redirect(`${config.frontend_url}/payment-cancel`);
        }

        if (useTransaction) await session.abortTransaction();
        session.endSession();

        // If status unknown
        return res.status(400).json({ message: 'Invalid payment status' });
    } catch (error) {
        if (useTransaction) await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

const getairlinePersonVerifications = async (query: Record<string, unknown>) => {
    const airlinePersonVerificationQuery = new QueryBuilder(AirlinePersonVerification.find(), query)
        .paginate()
        .search(airlinePersonVerificationSearchableFields)
        .fields()
        .filter()
        .sort();

    const result = await airlinePersonVerificationQuery.modelQuery;
    const pagination = await airlinePersonVerificationQuery.getPaginationInfo();

    return { pagination, result };
};

const getairlinePersonVerificationById = async (id: string) => {
    return AirlinePersonVerification.findById(id);
};

const updateairlinePersonVerification = async (id: string, payload: Partial<IairlinePersonVerification>) => {
    return AirlinePersonVerification.findByIdAndUpdate(id, payload, { new: true });
};

const deleteairlinePersonVerification = async (id: string) => {
    return AirlinePersonVerification.findByIdAndDelete(id);
};

export const AirlinePersonVerificationService = {
    createairlinePersonVerification,
    handleAirlinePersonVerificationRedirect,
    getairlinePersonVerifications,
    getairlinePersonVerificationById,
    updateairlinePersonVerification,
    deleteairlinePersonVerification,
};
