import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { VerificationPlanController } from '../verificationPlan/verificationPlan.controller';
import { ConversationController } from './conversaion.controller';

const router = express.Router();

router
  .route('/')
  .post(
    auth(
      USER_ROLES.ADMIN,
      USER_ROLES.SUPER_ADMIN,
      USER_ROLES.GUEST,
      USER_ROLES.HOST
    ),
    ConversationController.createConversation
  )
  .get(
    auth(
      USER_ROLES.ADMIN,
      USER_ROLES.SUPER_ADMIN,
      USER_ROLES.GUEST,
      USER_ROLES.HOST
    ),
    ConversationController.getAllConversaions
  );

export const ConversationRoutes = router;
