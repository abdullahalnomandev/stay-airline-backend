import express, { NextFunction, Request, Response } from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { AirlinePersonVerificationController } from './airlineVerification.controller';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import { AirlinePersonVerification } from './airlineVerificaiton.validation';

const router = express.Router();

router
  .route('/')
  .post(
    fileUploadHandler(),
    (req: Request, res: Response, next: NextFunction) => {
      if (req.body.data) {
        req.body = AirlinePersonVerification.createAirlinePersonZodSchema.parse(
          JSON.parse(req.body.data)
        );
      }
      return AirlinePersonVerificationController.createairlinePersonVerification(req, res, next);
    }
  )
  .get(AirlinePersonVerificationController.createairlinePersonVerification);

router
  .route('/webhook/:id')
  .get(AirlinePersonVerificationController.airlinePersonPaymentVerificationEvent);

router
  .route('/:id')
  .get(AirlinePersonVerificationController.getairlinePersonVerificationById)
  .patch(
    auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    AirlinePersonVerificationController.updateairlinePersonVerification
  )
  .delete(
    auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    AirlinePersonVerificationController.deleteairlinePersonVerification
  );

export const airlinePersonVerificationRoutes = router;