import ApiError from '../../../errors/ApiError';
import QueryBuilder from '../../builder/QueryBuilder';
import { ISubscribe } from './subscribe.interface';
import { Subscribe } from './subscribe.model';
import { StatusCodes } from "http-status-codes";

const createSubscribe = async (
  payload: ISubscribe,
): Promise<ISubscribe | null> => {
  const isExist = await Subscribe.findOne({ email: payload.email });
  if (isExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already subscribed');
  }
  const result = await Subscribe.create(payload);
  return result;
};

const getAllSubscribers = async (query: Record<string, unknown>) => {
    const subscribeQuery = new QueryBuilder(Subscribe.find(), query)
    .fields()
    .paginate();

    const result = await subscribeQuery.modelQuery;
    const pagination = await subscribeQuery.getPaginationInfo();
    
    return {
        pagination,
        result
    };
};

export const SubscribeService = {
  createSubscribe,
  getAllSubscribers,
};