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
    console.log(hotel)

    // if (!isUserExist) {
    //     throw new ApiError(StatusCodes.NOT_FOUND, 'Host not found');
    // }

    // if (!isUserExist?.connectedAccountId) {
    //     const stripe = new Stripe(config.stripe.secret_key as string);
    //      const account = await stripe.accounts.create({
    //         email:isUserExist.email as string,
    //         controller:{
    //             losses:{
    //                 payments:'application'
    //             },
    //             fees:{
    //                 payer:'application'
    //             },
    //             stripe_dashboard:{
    //                 type:'express'
    //             }
    //         },
    //         capabilities:{
    //             card_payments:{
    //                 requested:true
    //             },
    //             transfers:{
    //                 requested:true
    //             }
    //         },
    //         business_type:'individual'
    //     })
    //     await User.findByIdAndUpdate(hotel.hostId,{connectedAccountId:account.id,role:USER_ROLES.HOST});
    // }
    // if(!isUserExist?.stripeConnectedLink){
    //     hotel.status = HOTEL_STATUS.DRAFT
    // }

    // const result = await Hotel.create(hotel);
    // return result;
};

const getHoels = async (query: Record<string, unknown>) => {
    const latandLogAddress = await getLatLngFromAddress('Dhaka, Bangladesh');
    console.log({latandLogAddress})
    if (query.roomPrice) {
        query.roomPrice = { $lte: +query.roomPrice }
    }
    if (query.checkInDate) {
        const newDate = new Date(query.checkInDate as string);
        query.roomClosureDates = { $ne: newDate };
    }

    if (typeof query.coordinates === 'string' && JSON.parse(query.coordinates) && Array.isArray(JSON.parse(query.coordinates))) {
        const [lng, lat] = JSON.parse(query.coordinates);
        let radiusInKm = query.radius ? Number(query.radius) : 10;

        query.coordinates = {
            $geoWithin: {
                $centerSphere: [[lng, lat], radiusInKm / 3963.1]
            }
        }
    }

    delete query.radius;

    const productQuery = new QueryBuilder(Hotel.find(), query)
        .paginate()
        .search(hotelSearchableFields)
        .fields()
        .filter()
        .sort()

    const result = await productQuery.modelQuery;
    const pagination = await productQuery.getPaginationInfo();
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
