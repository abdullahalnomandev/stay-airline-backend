import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import { Hotel } from "../hotel/hotel.model";
import { IFavoriteHotel } from "./favorite.interface";
import { FavoriteHotel } from "./favorite.model";
import { User } from "../user/user.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { Review } from "../review/review.model";
const addToFavorites = async (payload: { hotel: string; user: string }): Promise<IFavoriteHotel | null> => {
    const existingFavorite = await FavoriteHotel.findOne({
        hotel: payload.hotel,
        user: payload.user
    });

    if (existingFavorite) {
        await FavoriteHotel.findByIdAndDelete(existingFavorite._id);
        return null;
    }

    const isHotelExist = await Hotel.findById(payload.hotel, '_id').lean();
    if (!isHotelExist) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Hotel not found');
    }

    const isUserExist = await User.findById(payload.user).lean();
    if (!isUserExist) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    }
    const newFavorite = await FavoriteHotel.create(payload);
    return newFavorite;
};

const getAllFavoriteHotels = async (query: Record<string, unknown>, userId: string) => {
    
    query.status = 'active';
    const favoriteIds = await FavoriteHotel.find({ user: userId }, '-_id hotel')
    const favoriteHotelIds = favoriteIds.map(fav => fav.hotel);

    query._id = { $in: favoriteHotelIds };

    const hotelQuery = new QueryBuilder(Hotel.find(), query)
        .paginate()
        .fields()
        .filter()
        .sort();

    const result = await hotelQuery.modelQuery;
    const pagination = await hotelQuery.getPaginationInfo();

    const hotelIds = result.map(h => h._id);

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

    const statsMap = new Map(
        reviewStats.map(s => [
            String(s._id),
            { totalReviews: s.totalReviews, avgRating: s.avgRating },
        ])
    );

    const favoriteHotels = await FavoriteHotel.find({
        user: userId,
    })

    const favoriteSet = new Set(favoriteHotels.map(f => String(f.hotel)));
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
export const FavoriteHotelService = {
    addToFavorites,
    getAllFavoriteHotels
};
