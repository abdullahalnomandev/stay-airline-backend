import express, { NextFunction, Request, Response } from 'express';
import auth from '../../../middlewares/auth';
import validateRequest from '../../../middlewares/validateRequest';
import { USER_ROLES } from '../../../../enums/user';
import { ContactInfoValidation } from './contactInfo.validation';
import { ContactInfoController } from './contactInfo.controller';

const router = express.Router();

router
  .route('/')
  .post(
    // auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    validateRequest(ContactInfoValidation.createContactInfoZodSchema),
    (req: Request, res: Response, next: NextFunction) => {
      return ContactInfoController.createContactInfo(req, res, next);
    }
  )
  .get(ContactInfoController.getAllContactInfo);

router
  .route('/:id')
  .get(ContactInfoController.getContactInfoByCategory)
  .patch(
    // auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    validateRequest(ContactInfoValidation.updateContactInfoZodSchema),
    ContactInfoController.updateContactInfo
  )
  .delete(
    // auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    ContactInfoController.deleteContactInfo
  );

export const ContactInfoRoute = router;
