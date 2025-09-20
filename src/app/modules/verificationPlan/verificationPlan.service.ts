import QueryBuilder from "../../builder/QueryBuilder";
import { verificationPlanSearchableFields } from "./verificationPlan.constant";
import { IVerificationPlan } from "./verificaitonPlan.interface";
import { VerificationPlan } from "./verificationPlan.model";

const createVerificationPlan = async (verificationPlan: IVerificationPlan) => {
    return await VerificationPlan.create(verificationPlan);
};

const getVerificationPlans = async (query: Record<string, unknown>) => {

    query.active = true;
    const verificationPlanQuery = new QueryBuilder(VerificationPlan.find(), query)
        .paginate()
        .search(verificationPlanSearchableFields)
        .fields()
        .filter()
        .sort();

    const result = await verificationPlanQuery.modelQuery;
    const pagination = await verificationPlanQuery.getPaginationInfo();
    
    return {
        pagination,
        result
    };
};

const getVerificationPlanById = async (id: string) => {
    const result = await VerificationPlan.findById(id);
    return result;
};

const updateVerificationPlan = async (id: string, payload: Partial<IVerificationPlan>) => {
    const result = await VerificationPlan.findByIdAndUpdate(
        id,
        payload,
        { new: true }
    );
    return result;
};

const deleteVerificationPlan = async (id: string) => {
    const result = await VerificationPlan.findByIdAndDelete(id);
    return result;
};

export const VerificationPlanService = {
    createVerificationPlan,
    getVerificationPlans,
    getVerificationPlanById,
    updateVerificationPlan,
    deleteVerificationPlan
};