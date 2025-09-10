import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { LegalDocumentService } from './legalDocument.service';

const createLegalDocument = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await LegalDocumentService.createLegalDocument(req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Legal document created successfully',
      data: result,
    });
  }
);

const getAllLegalDocuments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await LegalDocumentService.getAllLegalDocuments(req.query);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Legal documents retrieved successfully',
      data: result,
    });
  }
);

const getSingleLegalDocument = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await LegalDocumentService.getSingleLegalDocument(id);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Legal document retrieved successfully',
      data: result,
    });
  }
);

const updateLegalDocument = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await LegalDocumentService.updateLegalDocument(id, req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Legal document updated successfully',
      data: result,
    });
  }
);

const deleteLegalDocument = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await LegalDocumentService.deleteLegalDocument(id);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Legal document deleted successfully',
      data: result,
    });
  }
);

export const LegalDocumentController = {
  createLegalDocument,
  getAllLegalDocuments,
  getSingleLegalDocument,
  updateLegalDocument,
  deleteLegalDocument,
};