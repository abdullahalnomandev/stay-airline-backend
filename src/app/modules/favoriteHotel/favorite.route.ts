import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { FavoriteHotelController } from './favorite.controller';

const router = express.Router();

router
  .route('/')
  .post(
    auth(USER_ROLES.GUEST, USER_ROLES.HOST ),
     FavoriteHotelController.addToFavorites
    )
export const FavoriteHotelRoutes = router;
