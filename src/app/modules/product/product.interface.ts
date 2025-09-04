import { Model } from "mongoose";

export type IProduct = {
    name: string;
    price: string;
    descirptin: string;
    image: string;
}

export type IProductModel = Model<IProduct, Record<string, unknown>>
