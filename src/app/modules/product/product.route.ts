import express, { NextFunction, Request, Response } from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { ProductController } from './product.controller';
const router = express.Router();

router
    .route('/').post(
        // auth(USER_ROLES.ADMIN, USER_ROLES.USER), 
        ProductController.createProduct)
    .get(
        // auth(USER_ROLES.ADMIN, USER_ROLES.USER),
        ProductController.getProduct)

export const ProductRoutes = router;
