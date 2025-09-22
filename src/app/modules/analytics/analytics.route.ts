import express, { NextFunction, Request, Response } from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { analyticsController } from './analytics.controller';
const router = express.Router();




router.route('/:year').get(
    auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),
    (req: Request, res: Response, next: NextFunction) => {
        return analyticsController.getAnalytics(req, res, next);
    })

router.route('/host/:year/:hostId').get(
    auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),
    (req: Request, res: Response, next: NextFunction) => {
        return analyticsController.getAnalyticsHoseWise(req, res, next);
    })

export const AnalyticsRoutes = router;
