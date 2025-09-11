import express, { NextFunction, Request, Response } from 'express';
import auth from '../../../middlewares/auth';
import validateRequest from '../../../middlewares/validateRequest';
import { USER_ROLES } from '../../../../enums/user';
import { ContactCategoryValidation } from './contactCategory.validaiton';
import { ContactCategoryController } from './contactCategory.controller';

const router = express.Router();

router
  .route('/')
  .post(
    // auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    validateRequest(ContactCategoryValidation.createContactCategoryZodSchema),
    (req: Request, res: Response, next: NextFunction) => {
      return ContactCategoryController.createContactCategory(req, res, next);
    }
  )
  .get(ContactCategoryController.getAllContactCategories);

router
  .route('/:id')
  .get(ContactCategoryController.getSingleContactCategory)
  .patch(
    // auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    validateRequest(ContactCategoryValidation.updateContactCategoryZodSchema),
    ContactCategoryController.updateContactCategory
  )
  .delete(
    // auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    ContactCategoryController.deleteContactCategory
  );

export const ContactCategoryRoute = router;
