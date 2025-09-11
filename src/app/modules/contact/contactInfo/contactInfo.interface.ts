import mongoose, { Model } from "mongoose";
import { IContactCategory } from "../contactCategory/contactCategory.interfac";

export type IContactInfo = {
    contactCategory: mongoose.Types.ObjectId | IContactCategory;
    name: string;
    phone: string;
    website: string;
}

export type IContactInfoModel = Model<IContactInfo, Record<string, unknown>>;
