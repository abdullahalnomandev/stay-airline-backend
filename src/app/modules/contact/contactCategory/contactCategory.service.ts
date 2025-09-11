import { StatusCodes } from "http-status-codes";

import { ContactCategory } from "./contactCategory.model";
import { IContactCategory } from "./contactCategory.interfac";
import QueryBuilder from "../../../builder/QueryBuilder";
import ApiError from "../../../../errors/ApiError";
import { ContactInfo } from "../contactInfo/contactInfo.moel";
const createContactCategory = async (payload: IContactCategory): Promise<IContactCategory> => {
    const result = await ContactCategory.create(payload);
    return result;
};

const getAllContactCategories = async (query: Record<string, unknown>) => {
    const contactCategoryQuery = new QueryBuilder(ContactCategory.find(), query)
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await contactCategoryQuery.modelQuery;
    const pagination = await contactCategoryQuery.getPaginationInfo();
    
    return {
        pagination,
        data: result
    };
};

const getSingleContactCategory = async (id: string): Promise<IContactCategory | null> => {
    const result = await ContactCategory.findById(id);
    
    if (!result) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Contact category not found');
    }

    return result;
};

const updateContactCategory = async (
    id: string, 
    payload: Partial<IContactCategory>
): Promise<IContactCategory | null> => {
    const result = await ContactCategory.findByIdAndUpdate(
        id,
        payload,
        { new: true }
    );

    if (!result) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Contact category not found');
    }

    return result;
};

const deleteContactCategory = async (id: string): Promise<IContactCategory | null> => {

    const category = await ContactCategory.findById(id);
    if (!category) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Contact category not found');
    }
    await ContactInfo.deleteMany({ contactCategory: id });
    
    const result = await ContactCategory.findByIdAndDelete(id);
    
    return result;
};

export const ContactCategoryService = {
    createContactCategory,
    getAllContactCategories,
    getSingleContactCategory,
    updateContactCategory,
    deleteContactCategory
};
