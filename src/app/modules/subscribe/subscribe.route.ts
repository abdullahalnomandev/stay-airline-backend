import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { SubscribeController } from './subscribe.controller';
import { SubscribeValidation } from './subscribe.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post(
  '/',
  validateRequest(SubscribeValidation.createSubscribeZodSchema),
  SubscribeController.createSubscribe,
);

router.get('/',
  //  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
 SubscribeController.getAllSubscribers);

export const SubscribeRoutes = router;