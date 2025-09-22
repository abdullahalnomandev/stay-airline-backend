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
import { ReviewRoute } from '../app/modules/review/review.route';
import { LegalDocumentRoutes } from '../app/modules/legalDocument/legalDocument.route';
import { ContactCategoryRoute } from '../app/modules/contact/contactCategory/contactCategory.route';
import { ContactInfoRoute } from '../app/modules/contact/contactInfo/contactInfo.route';
import { FacilityRoutes } from '../app/modules/facilities/facilities.route';
import { AnalyticsRoutes } from '../app/modules/analytics/analytics.route';
import { FavoriteHotelRoutes } from '../app/modules/favoriteHotel/favorite.route';
import { NotificationRoute } from '../app/modules/notification/notification.route';
import { SubscribeRoutes } from '../app/modules/subscribe/subscribe.route';
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
  },
  {
    path:'/review',
    route:ReviewRoute
  },
  {
    path:'/legal-document',
    route:LegalDocumentRoutes
  },
  {
    path:'/contact-category',
    route:ContactCategoryRoute
  },
  {
    path:'/contact-info',
    route:ContactInfoRoute
  },
  {
    path:'/facilitiy',
    route:FacilityRoutes
  },
  {
    path:'/analytics',
    route:AnalyticsRoutes
  },
  {
    path:'/favourite',
    route:FavoriteHotelRoutes
  },
  {
    path:'/notificaiton',
    route:NotificationRoute
  },
  {
    path:'/subscribe',
    route:SubscribeRoutes
  },

];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
