import express, { NextFunction, Request, Response } from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import { HotelValidation } from './hotel.validaiton';
import { HotelController } from './hotel.controller';

const router = express.Router();


router
  .route('/')
  .post(
    auth(USER_ROLES.HOST, USER_ROLES.GUEST),
    fileUploadHandler([
      { name: 'image', maxCount: 10 },
      { name: 'media', maxCount: 3 },
      { name: 'doc', maxCount: 1 },
    ]),
    HotelController.createHotel)
  .get(HotelController.getAllHotels);


router
  .route('/listing-history')
  .get(
    auth(USER_ROLES.HOST, USER_ROLES.GUEST),
    (req: Request, res: Response, next: NextFunction) => {
      return HotelController.ListingHistory(req, res, next);
    }
  );

router
  .route('/listing-history/:id')
  .delete(
    auth(USER_ROLES.HOST, USER_ROLES.GUEST, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    (req: Request, res: Response, next: NextFunction) => {
      return HotelController.deleteListingHistory(req, res, next);
    }
  );

router
  .route('/account-link')
  .get(
    auth(USER_ROLES.HOST, USER_ROLES.GUEST),
    (req: Request, res: Response, next: NextFunction) => {
      return HotelController.getAccountLink(req, res, next);
    }
  );


router
  .route('/:id')
  .get((req: Request, res: Response, next: NextFunction) => {
    return HotelController.getSingleHotel(req, res, next);
  })
  .patch(
    auth(USER_ROLES.HOST, USER_ROLES.GUEST),
    fileUploadHandler([
      { name: 'image', maxCount: 10 },
      { name: 'media', maxCount: 3 },
      { name: 'doc', maxCount: 1 },
    ]),
    (req: Request, res: Response, next: NextFunction) => {
      return HotelController.updateHotel(req, res, next);
    }
  );

export const HotelRoutes = router;
