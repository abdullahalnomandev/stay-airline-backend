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
import { getLatLongWithLocalRequest } from "./hotel.util";
import { Review } from "../review/review.model";
import { FavoriteHotel } from "../favoriteHotel/favorite.model";
import { Notification } from "../notification/notification.model";


const createHotel = async (hotel: IHotel) => {

    const isUserExist = await User.findById(hotel.hostId);
    if (!isUserExist) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    }
    // const { latitude, longitude } = await getLatLngFromAddress(String(hotel.address));
    const { latitude, longitude } = await getLatLongWithLocalRequest(String(hotel.address));
    hotel.location = {
        type: "Point",
        coordinates: [longitude, latitude] // [lng, lat] 
    }

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
        hotel.status = HOTEL_STATUS.PENDING
    }


    const result = await Hotel.create(hotel);
    const notificaiton = await Notification.create({
        title: "New Hotel Listed",
        message: `A new hotel "${result.name}" has been created`,
        path: "/hotels",
        refId: result._id
    });
    (global as any).io.emit("new_notificaiton", notificaiton)

    return result;
};

const updateHotel = async (hotelData: Partial<IHotel>, hotelId: string) => {
    const hotel = await Hotel.findOne({ _id: hotelId, hostId: hotelData.hostId });
    const userExists = await User.findById(hotelData.hostId);
    if (!hotel) {
        if (!userExists) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
        }
        throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have permission to update this hotel');
    }

    if (hotelData.address) {
        const { latitude, longitude } = await getLatLongWithLocalRequest(String(hotelData.address));
        if (latitude != null && longitude != null) {
            hotelData.location = {
                type: 'Point',
                coordinates: [longitude, latitude], // [lng, lat]
            };
        }
    }

    if (hotelData.status === HOTEL_STATUS.ACTIVE && !userExists?.stripeConnectedLink) {
        hotelData.status = HOTEL_STATUS.DRAFT
    }

    const updatedHotel = await Hotel.findByIdAndUpdate(hotelId, hotelData, {
        new: true,
        runValidators: true
    });

    return updatedHotel;
};

// const getHotels = async (query: Record<string, unknown>) => {

//     const { lat, lng, km, roomType: type } = query;

//     if (query.roomPrice) {
//         query.roomPrice = { $lte: +query.roomPrice }
//     }
//     if (query.checkInDate) {
//         query.checkInDate = { $gte: new Date(query.checkInDate as string) }
//     }

//     if (query.roomType) {
//         query.roomType = type;
//     }

//     if (lat && lng) {
//         const radiusInMeters = (Number(km) || 10) * 1000; // default 10 km
//         query.location = {
//             $geoWithin: {
//                 $centerSphere: [[Number(lng), Number(lat)], radiusInMeters / 6378.1] // radius in radians
//             }
//         };
//     }


//     // console.log(query)
//     const hotelQuery = new QueryBuilder(Hotel.find(), query)
//         .paginate()
//         .search(hotelSearchableFields)
//         .filter()
//         .sort()



//     const result = await hotelQuery.modelQuery;
//     const reviews = await Review.find({ hotel: { $in: result.map(hotel => hotel._id) } });
//     const avg = Review.rating

//     console.log(reviews)

//     const pagination = await hotelQuery.getPaginationInfo();
//     return {
//         pagination,
//         result
//     };
// };


const getHotels = async (query: Record<string, unknown>) => {
    const { lat, lng, km, roomType: type, userId } = query;

    if (query.roomPrice) {
        query.roomPrice = { $lte: +query.roomPrice };
    }
    if (query.checkInDate) {
        query.checkInDate = { $gte: new Date(query.checkInDate as string) };
    }
    if (query.roomType) {
        query.roomType = type;
    }

    query.status = 'active';

    if (lat && lng) {
        const radiusInMeters = (Number(km) || 10) * 1000; // default 10 km
        query.location = {
            $geoWithin: {
                $centerSphere: [
                    [Number(lng), Number(lat)],
                    radiusInMeters / 6378.1, // radius in radians
                ],
            },
        };
    }

    // Use QueryBuilder for hotels
    const hotelQuery = new QueryBuilder(Hotel.find(), query)
        .paginate()
        .fields()
        .search(hotelSearchableFields)
        .filter()
        .sort();

    const result = await hotelQuery.modelQuery;
    const pagination = await hotelQuery.getPaginationInfo();

    // ✅ Get all hotel IDs
    const hotelIds = result.map(h => h._id);

    // ✅ Aggregate reviews by hotel
    const reviewStats = await Review.aggregate([
        { $match: { hotel: { $in: hotelIds } } },
        {
            $group: {
                _id: "$hotel",
                totalReviews: { $sum: 1 },
                avgRating: { $avg: "$rating" },
            },
        },
    ]);

    // ✅ Map stats by hotelId for quick lookup
    const statsMap = new Map(
        reviewStats.map(s => [
            String(s._id),
            { totalReviews: s.totalReviews, avgRating: s.avgRating },
        ])
    );

    // ✅ Fetch user favorites
    const favoriteHotels = await FavoriteHotel.find({
        user: userId,
    })

    const favoriteSet = new Set(favoriteHotels.map(f => String(f.hotel)));

    // ✅ Attach stats to hotel results
    const hotelsWithStats = result.map(hotel => {
        const stats = statsMap.get(String(hotel._id as string)) || {
            totalReviews: 0,
            avgRating: 0,
        };
        return {
            // @ts-ignore
            ...hotel.toObject(),
            ...stats,
            isFavorite: favoriteSet.has(String(hotel._id))

        };
    });

    return {
        pagination,
        result: hotelsWithStats,
    };
};

const getSingleHotel = async (hotelId: string) => {
    const hotel = await Hotel.findById(hotelId).populate('facilities').lean();

    if (!hotel) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Hotel not found');
    }

    return hotel
};

const getListingHistory = async (query: Record<string, any>, hostId: string) => {

    query.hostId = hostId

    const hotelQuery = new QueryBuilder(Hotel.find(), query)
        .paginate()
        .filter()
        .sort()
        .fields()

    const result = await hotelQuery.modelQuery;
    const pagination = await hotelQuery.getPaginationInfo();
    return {
        pagination,
        result
    };

};

const deleteListingHistory = async (hostId: string, hotelId: string) => {
    const deletedHotel = await Hotel.findOneAndDelete({ hostId, _id: hotelId });

    if (!deletedHotel) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Hotel not found');
    }

    return deletedHotel; // returns the deleted hotel document
};


const createAccountLink = async (hotelId: string) => {
    return Hotel.findById(hotelId)

};



export const HotelService = {
    createHotel,
    getHotels,
    getSingleHotel,
    updateHotel,
    getListingHistory,
    deleteListingHistory,
    createAccountLink
}