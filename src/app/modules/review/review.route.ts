import express, { NextFunction, Request, Response } from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { ReviewController } from './review.controller';
import { ReviewValidation } from './review.validation';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();


router
  .route('/')
  .post(
    auth(USER_ROLES.HOST, USER_ROLES.GUEST),
    validateRequest(ReviewValidation.createReviewZodSchema),
    (req: Request, res: Response, next: NextFunction) => {
      return ReviewController.createReview(req, res, next);
    }
  );


export const ReviewRoute = router;
