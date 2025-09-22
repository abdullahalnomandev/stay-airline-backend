import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { LegalDocumentValidation } from './legalDocument.validate';
import { LegalDocumentController } from './legalDocument.controller';

const router = express.Router();

router
    .route('/')
    .post(
        auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
        (req, res, next) => {
            req.body = LegalDocumentValidation.createLegalDocumentZodSchema.parse(req.body);
            return LegalDocumentController.createLegalDocument(req, res, next);
        }
    )
    .get(
        auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
        LegalDocumentController.getAllLegalDocuments
    );

router
    .route('/:id')
    .get(
        auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
        LegalDocumentController.getSingleLegalDocument
    )
    .patch(
        auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
        (req, res, next) => {
            req.body = LegalDocumentValidation.updateLegalDocumentZodSchema.parse(req.body);
            return LegalDocumentController.updateLegalDocument(req, res, next);
        }
    )
    .delete(
        auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
        LegalDocumentController.deleteLegalDocument
    );

export const LegalDocumentRoutes = router;
