import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import unlinkFile from '../../../shared/unlinkFile';
import { IFacility } from './facilities.interface';
import { Facility } from './facilities.model';
import QueryBuilder from '../../builder/QueryBuilder';

const createFacilityToDB = async (payload: IFacility): Promise<IFacility> => {
  const facility = await Facility.create(payload);
  if (!facility) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create facility');
  }
  return facility;
};

const getFacilityFromDB = async (facilityId: string): Promise<IFacility> => {
  const facility = await Facility.findById(facilityId);
  if (!facility) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Facility doesn't exist!");
  }
  return facility;
};

const updateFacilityToDB = async (
  facilityId: string,
  payload: Partial<IFacility>
): Promise<IFacility | null> => {
  const facility = await Facility.findById(facilityId);
  if (!facility) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Facility doesn't exist!");
  }

  if (payload.logo && facility.logo) {
    unlinkFile(facility.logo);
  }

  const updatedFacility = await Facility.findOneAndUpdate(
    { _id: facilityId },
    payload,
    { new: true }
  );

  return updatedFacility;
};

const getAllFacilities = async (query: Record<string, any>) => {  
  const result = new QueryBuilder(Facility.find(), query).paginate().fields();

  const data = await result.modelQuery.lean();
  const pagination = await result.getPaginationInfo();

  return {
    pagination,
    data,
  };
};

const deleteFacilityFromDB = async (
  facilityId: string
): Promise<IFacility | null> => {
  const facility = await Facility.findById(facilityId);
  if (!facility) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Facility doesn't exist!");
  }

  if (facility.logo) {
    unlinkFile(facility.logo);
  }

  const deletedFacility = await Facility.findByIdAndDelete(facilityId);
  return deletedFacility;
};

export const FacilityService = {
  createFacilityToDB,
  getFacilityFromDB,
  updateFacilityToDB,
  getAllFacilities,
  deleteFacilityFromDB,
};
