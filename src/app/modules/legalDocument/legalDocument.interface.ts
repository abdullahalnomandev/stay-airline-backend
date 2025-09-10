import { Model } from "mongoose";

export type ILegalDocument = {
    title: string;
    slug: string;
    content: string;
}

export type ILegalDocumentModel = Model<ILegalDocument, Record<string, unknown>>
