import { model, Schema } from 'mongoose';
import { ILegalDocument, ILegalDocumentModel } from './legalDocument.interface';

const legalDocumentSchema = new Schema<ILegalDocument, ILegalDocumentModel>(
    {

        title: {
            type: String,
            required: true
        },
        slug: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

export const LegalDocument = model<ILegalDocument, ILegalDocumentModel>('LegalDocument', legalDocumentSchema);
