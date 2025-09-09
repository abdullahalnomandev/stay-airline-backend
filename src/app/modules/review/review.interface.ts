import mongoose, { Model } from "mongoose";
import { IUser } from "../user/user.interface";
import { IHotel } from "../hotel/hotel.interface";

export type IReview = {
    hotel: mongoose.Types.ObjectId | IHotel;
    content: string;
    user: mongoose.Types.ObjectId | IUser;
    rating: number;
    isVisible: boolean;
}

export type IReviewModel = Model<IReview, Record<string, unknown>>
