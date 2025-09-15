import express, { NextFunction, Request, Response } from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import { FacilityController } from './facilities.controller';
const router = express.Router();

router
  .route('/')
  .post(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    fileUploadHandler(),
    (req: Request, res: Response, next: NextFunction) => {
      return FacilityController.createFacility(req, res, next);
    }
  )
  .get(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.HOST, USER_ROLES.GUEST),
    (req: Request, res: Response, next: NextFunction) => {
      return FacilityController.getAllFacilities(req, res, next);
    }
  );

router
  .route('/:id')
  .get(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.HOST, USER_ROLES.GUEST),
    (req: Request, res: Response, next: NextFunction) => {
      return FacilityController.getFacility(req, res, next);
    }
  )
  .patch(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    fileUploadHandler(),
    (req: Request, res: Response, next: NextFunction) => {
      return FacilityController.updateFacility(req, res, next);
    }
  )
  .delete(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    (req: Request, res: Response, next: NextFunction) => {
      return FacilityController.deleteFacility(req, res, next);
    }
  );

export const FacilityRoutes = router;
