import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import { getMultipleFilesPath, getSingleFilePath } from '../../../shared/getFilePath';
import sendResponse from '../../../shared/sendResponse';
import { HotelService } from './hotel.service';

const createHotel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const hostId = req.user?.id;
    const { ...hotelData } = req.body;
    const roomImages = getMultipleFilesPath(req.files, 'image');
    const utilityBill = getSingleFilePath(req.files, 'doc');
    hotelData.image = roomImages;
    hotelData.utilityBill = utilityBill;
    hotelData.roomPrice = Number(hotelData.roomPrice);
    hotelData.hostId = hostId;

    const result = await HotelService.createHotel(hotelData);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Hotel created successfully',
        data: result
    });
}
);

const updateHotel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const hostId = req.user?.id;
    const hotelId = req.params?.id
    const { ...hotelData } = req.body;
    const roomImages = getMultipleFilesPath(req.files, 'image');
    const utilityBill = getSingleFilePath(req.files, 'doc');
    hotelData.image = roomImages;
    hotelData.utilityBill = utilityBill;
    hotelData.roomPrice = Number(hotelData.roomPrice);
    hotelData.hostId = hostId;

    const result = await HotelService.updateHotel(hotelData,hotelId);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Hotel created successfully',
        data: result
    });
}
);


const getAllHotels = catchAsync(async (req: Request, res: Response) => {
    const result = await HotelService.getHotels(req.query);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Hotels retrieved successfully',
        data: result,
    });
});


const getSingleHotel = catchAsync(async (req: Request, res: Response) => {
    const hotelId = req.params.id
    const result = await HotelService.getSingleHotel(hotelId);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Hotels retrieved successfully',
        data: result,
    });
});

const getAccountLink = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id
    const result = await HotelService.createAccountLink(userId);
    
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Account link created successfully',
        data: result,
    });
});

const ListingHistory = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id
    const result = await HotelService.getListingHistory(req.query, userId);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Hotels retrieved successfully',
        data: result,
    });
});

const deleteListingHistory = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const hotelId = req.params?.id;
    const result = await HotelService.deleteListingHistory(userId,hotelId);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Hotels deleted successfully',
        data: result,
    });
});


export const HotelController = {
    createHotel,
    getAllHotels,
    getSingleHotel,
    updateHotel,
    ListingHistory,
    deleteListingHistory,
    getAccountLink

    
};
