import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { MesdsageService } from './message.service';

const createMessage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const sender = (req.user as any)?.id;
    const {receiver,text,conversation } = req.body;
    const image = '';
    const result = await MesdsageService.createMessage({sender, receiver, conversation,image});

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Message created successfully',
      data: result,
    });
  }
);

const getAllMessages = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const userId = req?.user?.id;
    const receiver = req.body?.id
    const result = await MesdsageService.getAllMessages(userId,receiver);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'conversations fetch successfully',
      data: result,
    });
  }
);



export const MessageController = {
  createMessage,
  getAllMessages
};