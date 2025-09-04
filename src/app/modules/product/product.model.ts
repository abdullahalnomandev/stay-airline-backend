import { model, Schema } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';
import { IProduct, IProductModel } from './product.interface';

const productSchema = new Schema<IProduct, IProductModel>(
    {
        name: {
            type: String,
            required: true,
        },
        price: {
            type: String,
            enum: Object.values(USER_ROLES),
            required: true,
        },
        descirptin: {
            type: String,
            required: true,
            select: 0,
            minlength: 8,
        },
        image: {
            type: String,
            required:false
        }

    },
    { timestamps: true }
);


export const Product = model<IProduct, IProductModel>('Product', productSchema);
