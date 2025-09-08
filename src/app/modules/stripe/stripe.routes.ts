import express, { NextFunction, Request, Response } from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { StripeController } from './stripe.controller';
const router = express.Router();


router.route('/create-link').get(
    auth(USER_ROLES.HOST,USER_ROLES.GUEST),
    (req: Request, res: Response, next: NextFunction) => {
        return StripeController.getAccountLink(req, res, next);
    })

router.route('/connect').post(
    (req: Request, res: Response, next: NextFunction) => {
        return StripeController.connect(req, res, next);
    })

export const StripeRoutes = router;
