import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { NotificationService } from './notificaiton.service';


const getUserNotifications = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const result = await NotificationService.getNotificationsByUser(req.query, userId);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Notifications retrieved successfully',
        data: result
    });
});

const getAllNotifications = catchAsync(async (req: Request, res: Response) => {
    const userId = req?.user?.id;
    const result = await NotificationService.getAllNotifications(req.query, userId);
    
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Notifications retrieved successfully',
        data: result
    });
});



const deleteNotification = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const userId = req.user?.id;
    const result = await NotificationService.deleteNotification(id, userId);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Notification deleted successfully',
        data: result
    });
});

const markAsSeen = catchAsync(async (req: Request, res: Response) => {
    const id = req.user.id;
    const notificationId = req.params.id;
    const result = await NotificationService.updateStatus(id,notificationId);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Notification marked as seen successfully',
        data: result
    });
});

const seenAll = catchAsync(async (req: Request, res: Response) => {
    const id = req.user.id;
    const result = await NotificationService.seenAll(id);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Notification marked as seen successfully',
        data: result
    });
});

export const NotificationController = {
    getUserNotifications,
    getAllNotifications,
    deleteNotification,
    markAsSeen,
    seenAll
};
