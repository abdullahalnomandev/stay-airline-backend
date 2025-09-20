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
  )
  .get(
    auth(USER_ROLES.HOST, USER_ROLES.GUEST),
    ReviewController.getAllReviews);

router
  .route('/status/:id')
  .patch(
    auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    (req: Request, res: Response, next: NextFunction) => {
      return ReviewController.updateStatus(req, res, next);
    }
  )

router
  .route('/admin')
  .get(
    auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    ReviewController.getAllReviewByAdmin);

router
  .route('/hotel/:hotelId')
  .get(ReviewController.getReviewsByHotel);

router
  .route('/:id')
  .get(ReviewController.getSingleReview)
  .patch(
    auth(USER_ROLES.HOST, USER_ROLES.GUEST),
    validateRequest(ReviewValidation.updateReviewZodSchema),
    ReviewController.updateReview
  )
  .delete(
    auth(USER_ROLES.HOST, USER_ROLES.GUEST, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    ReviewController.deleteReview
  );


export const ReviewRoute = router;
