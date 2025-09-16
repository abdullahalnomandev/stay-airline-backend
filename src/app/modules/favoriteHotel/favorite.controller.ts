import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { FavoriteHotelService } from './favorite.service';

const addToFavorites = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user?.id;
    const hotel = req.body.hotel;

    const result = await FavoriteHotelService.addToFavorites({
        hotel,
        user,
    });
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Hotel added to favorites successfully',
        data: result
    });
});


const getAllFavoriteHotels = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user?.id;

    const result = await FavoriteHotelService.getAllFavoriteHotels(req.query,user);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Favorite hotels retrieved successfully',
        data: result
    });
});


export const FavoriteHotelController = {
    addToFavorites,
    getAllFavoriteHotels
};
