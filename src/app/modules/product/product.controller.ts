import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import { getSingleFilePath } from '../../../shared/getFilePath';
import sendResponse from '../../../shared/sendResponse';
import { ProductService } from './product.service';

const createProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { ...productData } = req.body;
    const result = await ProductService.createProduct(productData);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'User created successfully',
      data: result,
    });
  }
);

const getProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.getProduct(req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Product data retrieved successfully',
    data: result,
  });
});



export const ProductController = { createProduct, getProduct };
