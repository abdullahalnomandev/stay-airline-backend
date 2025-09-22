import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AnalyticsServices } from './analytics.service';

const getAnalytics = catchAsync(async (req: Request, res: Response) => {

    const year = Number(req.params?.year) || new Date().getFullYear()
    const result = await AnalyticsServices.getAnalytics(year);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Analytics retrieved successfully',
        data: result,
    });
});

const getAnalyticsHoseWise = catchAsync(async (req: Request, res: Response) => {

    const year = Number(req.params?.year) || new Date().getFullYear()
    const hostId = req.params?.hostId;
    const result = await AnalyticsServices.getAnalyticsHoseWise(year,hostId);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Hostwise Analytics retrieved successfully',
        data: result,
    });
});

export const analyticsController = {
    getAnalytics,
    getAnalyticsHoseWise,
};
