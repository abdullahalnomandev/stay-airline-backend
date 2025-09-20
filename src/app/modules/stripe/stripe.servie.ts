import Stripe from "stripe";
import config from "../../../config";
import { User } from "../user/user.model";
import { IUser } from "../user/user.interface";
import ApiError from "../../../errors/ApiError";
import { StatusCodes } from "http-status-codes";
import { Request } from "express";


const createAccountLink = async (userId: string) => {
    const stripe = new Stripe(config.stripe.secret_key as string);
    const user = await User.findById(userId, 'connectedAccountId stripeConnectedLink').lean() as Partial<IUser>;

    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    }
    if (!user?.connectedAccountId) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'User not connected to stripe');
    }


    const accountLink = await stripe.accountLinks.create({
        account: user?.connectedAccountId as string,
        refresh_url: `${config.frontend_url}/billing?connectedAccountId=${user?.connectedAccountId}` as string,
        return_url: `${config.frontend_url}/return/${user?.connectedAccountId}` as string,
        type: "account_onboarding",
    });
    if (!accountLink) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Stripe account link not created');
    }

    return { createAccountLink: accountLink?.url };
};


const connectAccount = async (req: Request) => {

    const body = await new Promise<string>((resolve) => {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        });
        req.on('end', () => {
            resolve(data);
        });
    });
    const signature = req.headers['stripe-signature']

    let event;
    try {
        event = Stripe.webhooks.constructEvent(body, signature as string, config.stripe.webhook_secret as string)
    } catch (error) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Stripe webhook error');
    }

    switch (event.type) {
        case 'account.updated':
            const account = event.data.object;
            await User.findOneAndUpdate({ connectedAccountId: account.id }, {
                connectedAccountId: account.id,
                stripeConnectedLink: account.capabilities?.transfers === 'pending' || account.capabilities?.transfers === 'inactive' ? false : true
            })
            break;
        default:
            console.log('UNDLE EVENT')
            break;
    }

    return null;

}

export const StripeService = {
    createAccountLink,
    connectAccount
}

