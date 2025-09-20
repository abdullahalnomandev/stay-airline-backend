import { Schema, model } from "mongoose";
import { INotification } from "./notification.interface";
const notificationSchema = new Schema<INotification>(
  {
    title: {
      type: String,
      required: true
    },
    refId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    message: {
      type: String,
      required: true
    },
    seen: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export const Notification = model<INotification>("Notification", notificationSchema);
