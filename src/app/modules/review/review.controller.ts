import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ReviewService } from './review.service';

const createReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user?.id;

    const result = await ReviewService.createReview({
        ...req.body,
        user,
    });
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Review created successfully',
        data: result
    });
}
);


const getSingleReview = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await ReviewService.getSingleReview(id);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Review retrieved successfully',
        data: result
    });
});

const getReviewsByHotel = catchAsync(async (req: Request, res: Response) => {
    const hotelId = req.params.hotelId;
    const result = await ReviewService.getReviewsByHotel(req.query,hotelId);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Reviews retrieved successfully',
        data: result
    });
});

const getAllReviews = catchAsync(async (req: Request, res: Response) => {

    const hostId = req?.user?.id;
 
    const result = await ReviewService.getAllReviews(req.query,hostId);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Reviews retrieved successfully',
        data: result
    });
});

const getAllReviewByAdmin = catchAsync(async (req: Request, res: Response) => {
 
    const result = await ReviewService.getAllReviewsByAdmin();
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Reviews retrieved successfully',
        data: result
    });
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const userId = req.user?.id;
    const updatedData = req.body;

    const result = await ReviewService.updateReview(id, updatedData, userId);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Review updated successfully',
        data: result
    });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const userId = req.user?.id;
    const result = await ReviewService.deleteReview(id, userId);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Review deleted successfully',
        data: result
    });
});

const updateStatus = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await ReviewService.updateStatus(id);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Review status updated successfully',
        data: result
    });
});
export const ReviewController = {
    createReview,
    getSingleReview,
    getReviewsByHotel,
    getAllReviews,
    updateReview,
    deleteReview,
    getAllReviewByAdmin,
    updateStatus
};
