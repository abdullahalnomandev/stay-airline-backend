import express, { NextFunction, Request, Response } from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import { MessageController } from './message.controller';
import { MessageValidation } from './message.validation';
const router = express.Router();

router
    .route('/')
    .post(
        fileUploadHandler(),
        auth(USER_ROLES.ADMIN, USER_ROLES.HOST, USER_ROLES.SUPER_ADMIN, USER_ROLES.GUEST),
        (req: Request, res: Response, next: NextFunction) => {
            if (req.body.data) {
                req.body = MessageValidation.createMessageZodSchema.parse(
                    JSON.parse(req.body.data)
                );
            }
            return MessageController.sendMessage(req, res, next);
        }
    );

router.route('/:id')
    .get(
        auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.HOST , USER_ROLES.GUEST),
        MessageController.getAllMessages
    );

export const MessageRoutes = router;
