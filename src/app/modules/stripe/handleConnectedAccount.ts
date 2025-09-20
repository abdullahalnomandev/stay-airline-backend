import { StatusCodes } from 'http-status-codes';
import Stripe from 'stripe';
import stripe from '../../../config/stripe';
import { logger } from '../../../shared/logger';
import { User } from '../user/user.model';
import { Hotel } from '../hotel/hotel.model';
import { HOTEL_STATUS } from '../hotel/hotel.constant';

export const handleConnectedAccount = async (data: Stripe.Account) => {

    // Find the user by Stripe account ID
    const existingUser = await User.findOne({ email: data.email });

    if (!existingUser) {
        logger.info(`User not found for account ID: ${data.id}`);
    }



    // Check if the onboarding is complete
    if (data.charges_enabled) {
        const loginLink = await stripe.accounts.createLoginLink(data.id);
        // console.log(loginLink);

        // Save Stripe account information to the user record
        await User.findByIdAndUpdate(existingUser?._id, {
            connectedAccountId: data.id,
            stripeConnectedLink: loginLink?.url,

            // accountInformation:{
            //     stripeAccountId: data.id,
            //     accountUrl: loginLink.url,
            // }
        });

        
        // UPDATE HOTEL STATUS DRAFT TO ACTIVE
        if (existingUser?._id) {
            await Hotel.updateMany(
                { hostId: existingUser._id },
                { status: HOTEL_STATUS.ACTIVE }
            );
        }
    }

    return;
}