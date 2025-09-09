import express from 'express';
import { BookingController } from './booking.controller';
import validateRequest from '../../middlewares/validateRequest';
import { BookingValidation } from './booking.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();


router
  .route('/')
  .post( auth(USER_ROLES.HOST, USER_ROLES.GUEST), validateRequest(BookingValidation.createBookingZodSchema), BookingController.createBooking)
  .get(auth(USER_ROLES.HOST, USER_ROLES.GUEST, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),BookingController.getALlHostBookings);

router
  .route('/webhook/:id')
  .get(BookingController.cancelBooking);

router.get('/my-booking', auth(USER_ROLES.HOST,USER_ROLES.GUEST,USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN), BookingController.getMyBooking);

export const bookingRoutes = router;