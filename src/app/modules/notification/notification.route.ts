import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { NotificationController } from './notificaiton.controller';

const router = express.Router();

router
  .route('/')
  .get(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    NotificationController.getAllNotifications
  );

  router
  .route('/:id/seen')
  .patch(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.HOST),
    NotificationController.markAsSeen
  );

  router
  .route('/read-all')
  .patch(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.HOST),
    NotificationController.seenAll
  );
  
router
  .route('/:id')
  .delete(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    NotificationController.deleteNotification
  );



export const NotificationRoute = router;
