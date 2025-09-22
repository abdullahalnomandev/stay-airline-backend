import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import { getMultipleFilesPath, getSingleFilePath } from '../../../shared/getFilePath';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './user.service';

// const createUser = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { ...userData } = req.body;
//     const result = await UserService.createUserToDB(userData);

//     sendResponse(res, {
//       success: true,
//       statusCode: StatusCodes.OK,
//       message: 'User created successfully',
//     });
//   }
// );


const getUserProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const result = await UserService.getUserProfileFromDB(userId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Profile data retrieved successfully',
    data: result,
  });
});

//update profile
const updateProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const profilePic = getSingleFilePath(req.files, 'profilePic')
    let images = getMultipleFilesPath(req.files, 'image');
    const data = {
      images,
      profilePic,
      ...req.body,
    };
    const result = await UserService.updateProfileToDB(user, data);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Profile updated successfully',
      data: result,
    });
  }
);

//create user
const createNewUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    const profilePic = getSingleFilePath(req.files, 'profilePic')
    let images = getMultipleFilesPath(req.files, 'image');

    const data = {
      images,
      profilePic,
      ...req.body,
    };
    const result = await UserService.createNewUserToDB(data);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'User Created successfully',
      data: result,
    });
  }
);
//update profile
const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.user?.id;
    let images = getMultipleFilesPath(req.files, 'image');
    let profilePic = getSingleFilePath(req.files,'profilePic')

    const {name, email , contact, address } = req.body;
    const data = {
      images,
      profilePic,
      name,
      email,
      contact,
      address

    };
    const result = await UserService.updateUserToDB(userId, data);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'User Created successfully',
      data: result,
    });
  }
);

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllUsers(req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Users retrieved successfully',
    data: result,
  });
});

const deleteSingleUserFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.deleteUserFromDB(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Users retrieved successfully',
    data: result,
  });
});

const verifiyHost = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.verifyHost(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Users verifyed successfully',
    data: result,
  });
});

const getAllHost = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllHost(req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Hosts retrieved successfully',
    data: result,
  });
});

export const UserController = {
  updateUser,
  getUserProfile,
  updateProfile,
  createNewUser,
  getAllUsers,
  deleteSingleUserFromDB,
  verifiyHost,
  getAllHost
};
