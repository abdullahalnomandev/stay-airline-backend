import express, { NextFunction, Request, Response } from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
const router = express.Router();

router
  .route('/me')
  .get(
    auth(USER_ROLES.ADMIN, USER_ROLES.HOST, USER_ROLES.SUPER_ADMIN, USER_ROLES.GUEST),
    UserController.getUserProfile)
  .patch(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.HOST),
    fileUploadHandler(),
    (req: Request, res: Response, next: NextFunction) => {
      if (req.body.data) {
        req.body = UserValidation.updateUserZodSchema.parse(
          JSON.parse(req.body.data)
        );
      }
      return UserController.updateProfile(req, res, next);
    }
  );

router
  .route('/host')
  .get(
    // auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    UserController.getAllHost)

router
  .route('/')
  .post(fileUploadHandler(),
    (req: Request, res: Response, next: NextFunction) => {
      if (req.body.data) {
        req.body = UserValidation.createUserZodSchema.parse(
          JSON.parse(req.body.data)
        );
      }
      return UserController.createNewUser(req, res, next);
    }
  )
  .get((req: Request, res: Response, next: NextFunction) => {
      return UserController.getAllUsers(req, res, next);
    })
    .patch(
      fileUploadHandler(),
      auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN , USER_ROLES.HOST , USER_ROLES.GUEST),
      (req: Request, res: Response, next: NextFunction) => {
        return UserController.updateUser(req, res, next);
      }
    )

router
  .route('/:id')
  .patch(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    (req: Request, res: Response, next: NextFunction) => {
      return UserController.deleteSingleUserFromDB(req, res, next);
    })

router
  .route('/verify/:id')
  .patch(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    (req: Request, res: Response, next: NextFunction) => {
      return UserController.verifiyHost(req, res, next);
    })

export const UserRoutes = router;
