import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../../shared/catchAsync';
import { ContactCategoryService } from './contactCategory.service';
import sendResponse from '../../../../shared/sendResponse';

const createContactCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await ContactCategoryService.createContactCategory(req.body);
    
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Contact category created successfully',
        data: result
    });
});

const getSingleContactCategory = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await ContactCategoryService.getSingleContactCategory(id);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Contact category retrieved successfully',
        data: result
    });
});

const getAllContactCategories = catchAsync(async (req: Request, res: Response) => {
    const result = await ContactCategoryService.getAllContactCategories(req.query);
    
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Contact categories retrieved successfully',
        data: result
    });
});

const updateContactCategory = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const updatedData = req.body;

    const result = await ContactCategoryService.updateContactCategory(id, updatedData);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Contact category updated successfully',
        data: result
    });
});

const deleteContactCategory = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await ContactCategoryService.deleteContactCategory(id);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Contact category deleted successfully',
        data: result
    });
});

export const ContactCategoryController = {
    createContactCategory,
    getSingleContactCategory,
    getAllContactCategories,
    updateContactCategory,
    deleteContactCategory
};
