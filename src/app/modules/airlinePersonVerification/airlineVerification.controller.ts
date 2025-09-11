import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AirlinePersonVerificationService } from './airlineVerification.service';
import { getMultipleFilesPath } from '../../../shared/getFilePath';

const createairlinePersonVerification = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  let images = getMultipleFilesPath(req.files, 'image');
  const airlinePersonVerificationData = {
    ...req.body,
    images,
  }
  
  const origin = `${req.protocol}://${req.get('host')}`;
  const result = await AirlinePersonVerificationService.createairlinePersonVerification(origin, airlinePersonVerificationData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Airline verification created successfully',
    data: result,
  });
});

const getairlinePersonVerifications = catchAsync(async (req: Request, res: Response) => {
  
  const result = await AirlinePersonVerificationService.getairlinePersonVerifications(req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Airline verifications retrieved successfully',
    data: result,
  });
});

const getairlinePersonVerificationById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AirlinePersonVerificationService.getairlinePersonVerificationById(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Airline verification retrieved successfully',
    data: result,
  });
});

const updateairlinePersonVerification = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ...updateData } = req.body;
  const result = await AirlinePersonVerificationService.updateairlinePersonVerification(id, updateData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Airline verification updated successfully',
    data: result,
  });
});

const airlinePersonPaymentVerificationEvent = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, userId } = req.query as { status: string, userId: string };

  if (!status || !userId) {
    return sendResponse(res, {
      success: false,
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Missing required query parameters',
    });
  }

  AirlinePersonVerificationService.handleAirlinePersonVerificationRedirect(res, status as string, userId as string, id);


});

const deleteairlinePersonVerification = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AirlinePersonVerificationService.deleteairlinePersonVerification(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Airline verification deleted successfully',
    data: result,
  });
});

export const AirlinePersonVerificationController = {
  createairlinePersonVerification,
  getairlinePersonVerifications,
  getairlinePersonVerificationById,
  updateairlinePersonVerification,
  deleteairlinePersonVerification,
  airlinePersonPaymentVerificationEvent
};