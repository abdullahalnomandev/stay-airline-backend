import mongoose, { Model, Schema } from "mongoose";
import { IUser } from "../user/user.interface";

export interface INotification {
  title: string;
  refId: Schema.Types.ObjectId;
  path: string;
  receiver: Schema.Types.ObjectId | IUser;
  message: string;
  seen: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type INotificationModel = Model<INotification, Record<string, unknown>>
