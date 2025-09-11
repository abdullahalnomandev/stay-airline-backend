import { StatusCodes } from "http-status-codes";

import { IContactInfo } from "./contactInfo.interface";
import QueryBuilder from "../../../builder/QueryBuilder";
import ApiError from "../../../../errors/ApiError";
import { ContactInfo } from "./contactInfo.moel";
import { ContactCategory } from "../contactCategory/contactCategory.model";

const createContactInfo = async (payload: IContactInfo): Promise<IContactInfo> => {
    // Check if contact category exists
    const contactCategory = await ContactCategory.findById(payload.contactCategory);

    if (!contactCategory) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Contact category not found'
        );
    }

    const result = await ContactInfo.create(payload);
    return result;
};

const getAllContactInfo = async (query: Record<string, unknown>) => {
    const contactInfoQuery = new QueryBuilder(ContactInfo.find(), query)
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await contactInfoQuery.modelQuery.populate({
        path: 'contactCategory',
        select: 'title description' // Add the fields you want to populate
    })
    const pagination = await contactInfoQuery.getPaginationInfo();

    return {
        pagination,
        result
    };
};
const getContactByCategory = async (query: Record<string, unknown>, id: string) => {
    const contactInfoQuery = new QueryBuilder(ContactInfo.find({ contactCategory: id }), query)
        .filter()
        .sort()
        .paginate()
        .fields()
    const result = await contactInfoQuery.modelQuery
        .populate({
            path: 'contactCategory',
            select: 'title description' // Add the fields you want to populate
        })
        .exec();
    const pagination = await contactInfoQuery.getPaginationInfo();

    return {
        pagination,
        result
    };
};

const updateContactInfo = async (
    id: string,
    payload: Partial<IContactInfo>
): Promise<IContactInfo | null> => {
    const result = await ContactInfo.findByIdAndUpdate(
        id,
        payload,
        { new: true }
    );

    if (!result) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Contact info not found');
    }

    return result;
};

const deleteContactInfo = async (id: string): Promise<IContactInfo | null> => {
    const result = await ContactInfo.findByIdAndDelete(id);

    if (!result) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Contact info not found');
    }

    return result;
};

export const ContactInfoService = {
    createContactInfo,
    getAllContactInfo,
    getContactByCategory,
    updateContactInfo,
    deleteContactInfo
};
