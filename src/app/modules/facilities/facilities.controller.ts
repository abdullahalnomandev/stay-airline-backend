import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import { getSingleFilePath } from '../../../shared/getFilePath';
import sendResponse from '../../../shared/sendResponse';
import { FacilityService } from './facilities.service';

const createFacility = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const logo = getSingleFilePath(req.files, 'image');
    const data = {
      logo,
      ...req.body,
    };
    const result = await FacilityService.createFacilityToDB(data);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Facility created successfully',
      data: result,
    });
  }
);

const getFacility = catchAsync(async (req: Request, res: Response) => {
  const facilityId = req.params.id;
  const result = await FacilityService.getFacilityFromDB(facilityId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Facility retrieved successfully',
    data: result,
  });
});

const updateFacility = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const facilityId = req.params.id;
    const logo = getSingleFilePath(req.files, 'image');
    const data = {
      logo,
      ...req.body,
    };
    const result = await FacilityService.updateFacilityToDB(facilityId, data);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Facility updated successfully',
      data: result,
    });
  }
);

const getAllFacilities = catchAsync(async (req: Request, res: Response) => {
  const result = await FacilityService.getAllFacilities(req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Facilities retrieved successfully',
    data: result,
  });
});

const deleteFacility = catchAsync(async (req: Request, res: Response) => {
  const result = await FacilityService.deleteFacilityFromDB(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Facility deleted successfully',
    data: result,
  });
});

export const FacilityController = {
  createFacility,
  getFacility,
  updateFacility,
  getAllFacilities,
  deleteFacility,
};
