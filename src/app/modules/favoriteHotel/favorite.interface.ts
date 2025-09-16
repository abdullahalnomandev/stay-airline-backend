import mongoose, { Model } from "mongoose";
import { IUser } from "../user/user.interface";
import { IHotel } from "../hotel/hotel.interface";

export type IFavoriteHotel = {
    hotel: mongoose.Types.ObjectId | IHotel;
    user: mongoose.Types.ObjectId | IUser;
    isActive: boolean;
}

export type IFavoriteHotelModel = Model<IFavoriteHotel, Record<string, unknown>>
