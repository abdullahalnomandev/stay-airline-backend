import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import QueryBuilder from "../../builder/QueryBuilder";
import { User } from "../user/user.model";
import { IHotel } from "./hotel.interface";
import { Hotel } from "./hotel.model";
import { HOTEL_STATUS, hotelSearchableFields } from "./hotel.constant";
import Stripe from "stripe";
import config from "../../../config";
import { USER_ROLES } from "../../../enums/user";
import { getLatLngFromAddress } from "./hotel.util";


const createHotel = async (hotel: IHotel) => {
    const isUserExist = await User.findById(hotel.hostId);
    if (!isUserExist) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    }
    const { latitude, longitude } = await getLatLngFromAddress(String(hotel.address));
    hotel.location = {
        type: "Point",
        coordinates: [longitude, latitude] // [lng, lat] 
    }
    console.log(hotel)

    if (!isUserExist?.connectedAccountId) {
        const stripe = new Stripe(config.stripe.secret_key as string);
        const account = await stripe.accounts.create({
            email: isUserExist.email as string,
            controller: {
                losses: {
                    payments: 'application'
                },
                fees: {
                    payer: 'application'
                },
                stripe_dashboard: {
                    type: 'express'
                }
            },
            capabilities: {
                card_payments: {
                    requested: true
                },
                transfers: {
                    requested: true
                }
            },
            business_type: 'individual'
        })
        await User.findByIdAndUpdate(hotel.hostId, { connectedAccountId: account.id, role: USER_ROLES.HOST });
    }
    if (!isUserExist?.stripeConnectedLink) {
        hotel.status = HOTEL_STATUS.DRAFT
    }

    const result = await Hotel.create(hotel);
    return result;
};

const getHoels = async (query: Record<string, unknown>) => {

    const { lat, lng, km, roomType: type } = query;

    if (query.roomPrice) {
        query.roomPrice = { $lte: +query.roomPrice }
    }

    if (query.roomType) {
        query.roomType = type;
    }

    if (lat && lng) {
        const radiusInMeters = (Number(km) || 5) * 1000; // default 5 km
        query.location = {
            $geoWithin: {
                $centerSphere: [[Number(lng), Number(lat)], radiusInMeters / 6378.1] // radius in radians
            }
        };
    }

    // console.log(query)
    const hotelQuery = new QueryBuilder(Hotel.find(), query)
        .paginate()
        .search(hotelSearchableFields)
        .filter()

    const result = await hotelQuery.modelQuery;
    const pagination = await hotelQuery.getPaginationInfo();
    return {
        pagination,
        result
    };
};

const getSingleHotel = async (hotelId: string) => {
    return Hotel.findById(hotelId)

};
const createAccountLink = async (hotelId: string) => {
    return Hotel.findById(hotelId)

};


export const HotelService = {
    createHotel,
    getHoels,
    getSingleHotel,
    createAccountLink
}



// const createBookingCheckout = async (req, res) => {
//   const { hotelId } = req.body;
//   const hotel = await Hotel.findById(hotelId).populate("hostId");

//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ["card"],
//     mode: "payment",
//     customer_email: req.user.email,
//     line_items: [
//       {
//         price_data: {
//           currency: "usd",
//           product_data: {
//             name: hotel.name,
//           },
//           unit_amount: hotel.roomPrice * 100, // in cents
//         },
//         quantity: 1,
//       },
//     ],
//     payment_intent_data: {
//       application_fee_amount: Math.round(hotel.roomPrice * 0.1 * 100), // 10% fee for platform
//       transfer_data: {
//         destination: hotel.hostId.stripeAccountId, // send money to host
//       },
//     },
//     success_url: "https://yourapp.com/success",
//     cancel_url: "https://yourapp.com/cancel",
//   });

//   res.json({ url: session.url });
// };
