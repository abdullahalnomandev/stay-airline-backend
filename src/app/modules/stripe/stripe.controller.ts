import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StripeService } from './stripe.servie';

const getAccountLink = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id
    const result = await StripeService.createAccountLink(userId);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Account link created successfully',
        data: result,
    });
});

const connect = catchAsync(async (req: Request, res: Response) => {
    
    const result = await StripeService.connectAccount(req);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Account connected successfully',
        data: result,
    });
});

export const StripeController = {
    getAccountLink,
    connect
};
