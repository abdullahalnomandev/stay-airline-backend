import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { ProductRoutes } from '../app/modules/product/product.route';
import { VerificationPlanRoutes } from '../app/modules/verificationPlan/verificationPlan.route';
import { airlinePersonVerificationRoutes } from '../app/modules/airlinePersonVerification/airlineVerification.route';
const router = express.Router();

const apiRoutes = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/product',
    route: ProductRoutes,
  },
  {
    path: '/verification-plan',
    route: VerificationPlanRoutes,
  },
  {
    path: '/airline-verification',
    route: airlinePersonVerificationRoutes,
  },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
