import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import { Hotel } from "../hotel/hotel.model";
import { IFavoriteHotel } from "./favorite.interface";
import { FavoriteHotel } from "./favorite.model";
import { User } from "../user/user.model";
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



export const FavoriteHotelService = {
    addToFavorites
};
