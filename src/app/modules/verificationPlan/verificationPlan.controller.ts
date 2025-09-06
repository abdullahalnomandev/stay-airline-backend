import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { VerificationPlanService } from './verificationPlan.service';

const createVerificationPlan = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { ...verificationPlanData } = req.body;
    const result = await VerificationPlanService.createVerificationPlan(verificationPlanData);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Verification plan created successfully',
      data: result,
    });
  }
);

const getVerificationPlans = catchAsync(async (req: Request, res: Response) => {
  const result = await VerificationPlanService.getVerificationPlans(req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Verification plans retrieved successfully',
    data: result,
  });
});

const getVerificationPlanById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await VerificationPlanService.getVerificationPlanById(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Verification plan retrieved successfully',
    data: result,
  });
});

const updateVerificationPlan = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ...updateData } = req.body;
  const result = await VerificationPlanService.updateVerificationPlan(id, updateData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Verification plan updated successfully',
    data: result,
  });
});

const deleteVerificationPlan = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await VerificationPlanService.deleteVerificationPlan(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Verification plan deleted successfully',
    data: result,
  });
});

export const VerificationPlanController = {
  createVerificationPlan,
  getVerificationPlans,
  getVerificationPlanById,
  updateVerificationPlan,
  deleteVerificationPlan,
};