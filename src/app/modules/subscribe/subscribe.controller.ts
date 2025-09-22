import { Request, Response } from 'express';
import { StatusCodes } from "http-status-codes";
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { SubscribeService } from './subscribe.service';

const createSubscribe = catchAsync(async (req: Request, res: Response) => {
  const result = await SubscribeService.createSubscribe(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Subscribed successfully',
    data: result,
  });
});

const getAllSubscribers = catchAsync(async (req: Request, res: Response) => {
  const result = await SubscribeService.getAllSubscribers(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Subscribers retrieved successfully',
    data: result,
  });
});

export const SubscribeController = {
  createSubscribe,
  getAllSubscribers,
};