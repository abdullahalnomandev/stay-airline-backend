import { Model } from 'mongoose';

export type ISubscribe = {
  email: string;
};

export type SubscribeModel = Model<ISubscribe, Record<string, unknown>>;