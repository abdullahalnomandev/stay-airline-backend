import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { VerificationPlanRoutes } from '../app/modules/verificationPlan/verificationPlan.route';
import { airlinePersonVerificationRoutes } from '../app/modules/airlinePersonVerification/airlineVerification.route';
import { HotelRoutes } from '../app/modules/hotel/hotel.route';
import { bookingRoutes } from '../app/modules/booking/booking.route';
import { StripeRoutes } from '../app/modules/stripe/stripe.routes';
import { ConversationRoutes } from '../app/modules/conversation/conversation.route';
import { MessageRoutes } from '../app/modules/message/message.route';
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
    path: '/verification-plan',
    route: VerificationPlanRoutes,
  },
  {
    path: '/airline-verification',
    route: airlinePersonVerificationRoutes,
  },
  {
    path: '/hotel',
    route: HotelRoutes,
  },
  {
    path: '/booking',
    route: bookingRoutes,
  },
  {
    path: '/stripe',
    route: StripeRoutes,
  },
  {
    path: '/conversation',
    route: ConversationRoutes,
  },
  {
    path:'/message',
    route:MessageRoutes
  }
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
