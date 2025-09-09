import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import { getMultipleFilesPath, getSingleFilePath } from '../../../shared/getFilePath';
import sendResponse from '../../../shared/sendResponse';
import { ReviewService } from './review.service';

const createReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const hotel = req.user?.id;

    const result = await ReviewService.createReview({
        ...req.body,
        hotel,
    });
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Review created successfully',
        data: result
    });
}
);


export const ReviewController = {
    createReview,
    
};
