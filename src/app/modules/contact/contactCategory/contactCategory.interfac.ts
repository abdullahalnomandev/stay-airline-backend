import { Model } from "mongoose";

export type IContactCategory = {
    title: string;
}

export type IContactCategoryModel = Model<IContactCategory, Record<string, unknown>>
