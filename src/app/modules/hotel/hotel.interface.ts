import mongoose, { Model } from "mongoose";
import { HOTEL_STATUS, ROOM_TYPE } from "./hotel.constant";
import { IUser } from "../user/user.interface";

export type IHotel = {
    hostId: mongoose.Types.ObjectId | IUser;
    name: string;
    roomPrice: number;
    description: string;
    status: HOTEL_STATUS;
    roomType: ROOM_TYPE.SINGLE | ROOM_TYPE.DOUBLE;
    address: string;
    // address: {
    //     street: string;
    //     city: string;
    //     country: string;
    //     zip: string;
    // };
    location: {
        type: "Point";
        coordinates: [number, number]; // [lng, lat]
    };
    image?: string[];
    facilities?: mongoose.Types.ObjectId[];
    roomClosureDates?: Date[];
    hotelRules?: {
        title?: string;
        description?: string;
    }[];
    utilityBill?: string;
    _id?:string;
}

export type IHotelModel = Model<IHotel, Record<string, unknown>>
