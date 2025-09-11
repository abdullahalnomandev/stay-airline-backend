import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../../shared/catchAsync';
import sendResponse from '../../../../shared/sendResponse';
import { ContactInfoService } from './contactInfo.service';

const createContactInfo = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await ContactInfoService.createContactInfo(req.body);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Contact info created successfully',
        data: result
    });
});

const getContactInfoByCategory = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await ContactInfoService.getContactByCategory(req.query,id);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Contact info retrieved successfully',
        data: result
    });
});

const getAllContactInfo = catchAsync(async (req: Request, res: Response) => {
    const result = await ContactInfoService.getAllContactInfo(req.query);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Contact info retrieved successfully',
        data: result,
    });
});

const updateContactInfo = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const updatedData = req.body;

    const result = await ContactInfoService.updateContactInfo(id, updatedData);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Contact info updated successfully',
        data: result
    });
});

const deleteContactInfo = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await ContactInfoService.deleteContactInfo(id);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Contact info deleted successfully',
        data: result
    });
});

export const ContactInfoController = {
    createContactInfo,
    getContactInfoByCategory,
    getAllContactInfo,
    updateContactInfo,
    deleteContactInfo
};
