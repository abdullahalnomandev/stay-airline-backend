import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import { INotification } from "./notification.interface";
import { Notification } from "./notification.model";
import { User } from "../user/user.model";
import QueryBuilder from "../../builder/QueryBuilder";


const getAllNotifications = async (query: Record<string, unknown>, userId: string) => {
    // Add user filter to query
    // query.user = userId;

    const notificationQuery = new QueryBuilder(Notification.find(), query)
        .filter()
        .sort()
        .paginate();

    const result = await notificationQuery.modelQuery;
    const pagination = await notificationQuery.getPaginationInfo();

    const unreadNotificationCount = await Notification.countDocuments({ seen: false })

    return {
        pagination,
        unreadNotificationCount,
        result
    };
};



const getNotificationsByUser = async (query: Record<string, any>, userId: string) => {
    // Add user filter to query
    query.user = userId;
    query.isSeen = false;

    const notificationQuery = new QueryBuilder(Notification.find(), query)
        .filter()
        .paginate();

    const pagination = await notificationQuery.getPaginationInfo();
    const data = await notificationQuery.modelQuery.populate('user', '_id name').lean();

    return {
        pagination,
        data
    };
};



const deleteNotification = async (notificaitonId: string, userId: string): Promise<INotification | null> => {
    // Check if notification exists
    const notification = await Notification.findById(notificaitonId);
    if (!notification) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Notification not found');
    }

    // Delete the notification
    const deletedNotification = await Notification.findByIdAndDelete(notificaitonId);
    return deletedNotification;
};

const updateStatus = async (userId: string, notificaitonId: string): Promise<INotification | null> => {
    // Check if notification exists
    const notification = await Notification.findById(notificaitonId);
    if (!notification) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Notification not found');
    }
    // Mark notification as seen
    const updatedNotification = await Notification.findByIdAndUpdate(
        notification._id,
        { seen: true, receiver: userId },
        { new: true }
    );

    return updatedNotification;
};

const seenAll = async (userId: string) => {
    // Mark notification as seen
    await Notification.updateMany(
        { seen: false },
        { seen: true, receiver: userId },
        { new: true }
    );

};

export const NotificationService = {
    getNotificationsByUser,
    getAllNotifications,
    deleteNotification,
    updateStatus,
    seenAll
}