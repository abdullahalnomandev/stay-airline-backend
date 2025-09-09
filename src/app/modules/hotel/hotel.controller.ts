import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import { getMultipleFilesPath, getSingleFilePath } from '../../../shared/getFilePath';
import sendResponse from '../../../shared/sendResponse';
import { HotelService } from './hotel.service';

const createHotel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    // console.log(req.body)

    const hostId = req.user?.id;
    const { ...hotelData } = req.body;
    const roomImages = getMultipleFilesPath(req.files, 'image');
    const utilityBill = getSingleFilePath(req.files, 'doc');
    // hotelData.hotelRules = JSON.parse(hotelData.hotelRules);
    hotelData.image = roomImages;
    hotelData.doc = utilityBill;
    hotelData.roomPrice = Number(hotelData.roomPrice);
    hotelData.hostId = hostId;

    // console.log(hotelData)

    const result = await HotelService.createHotel(hotelData);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Hotel created successfully',
        data: result
    });
}
);


//update profile
// const updateProfile = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const user = req.user;
//     let image = getSingleFilePath(req.files, 'image');

//     const data = {
//       image,
//       ...req.body,
//     };
//     const result = await UserService.updateProfileToDB(user, data);

//     sendResponse(res, {
//       success: true,
//       statusCode: StatusCodes.OK,
//       message: 'Profile updated successfully',
//       data: result,
//     });
//   }
// );

//update profile
// const createNewUser = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {

//     let images = getMultipleFilesPath(req.files, 'image');
//     const data = {
//       images,
//       ...req.body,
//     };
//     console.log(req.files)
//     const result = await UserService.createNewUserToDB(data);

//     sendResponse(res, {
//       success: true,
//       statusCode: StatusCodes.OK,
//       message: 'User Created successfully',
//       data: result,
//     });
//   }
// );

const getAllHotels = catchAsync(async (req: Request, res: Response) => {
    const result = await HotelService.getHoels(req.query);

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

export const HotelController = {
    createHotel,
    getAllHotels,
    getSingleHotel,
    getAccountLink,
    
};
