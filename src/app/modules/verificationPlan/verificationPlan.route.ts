import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { VerificationPlanController } from './verificationPlan.controller';

const router = express.Router();

router
  .route('/')
  .post(
    auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    VerificationPlanController.createVerificationPlan
  )
  .get(VerificationPlanController.getVerificationPlans);

router
  .route('/:id')
  .get(VerificationPlanController.getVerificationPlanById)
  .patch(
    auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    VerificationPlanController.updateVerificationPlan
  )
  .delete(
    auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    VerificationPlanController.deleteVerificationPlan
  );

export const VerificationPlanRoutes = router;