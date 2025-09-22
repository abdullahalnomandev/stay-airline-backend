import { Schema, model } from 'mongoose';
import { ISubscribe, SubscribeModel } from './subscribe.interface';

const SubscribeSchema = new Schema<ISubscribe, SubscribeModel>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export const Subscribe = model<ISubscribe, SubscribeModel>(
  'Subscribe',
  SubscribeSchema,
);