import { Schema, model } from "mongoose";
import { IContactInfo } from "./contactInfo.interface";

const contactInfoSchema = new Schema<IContactInfo>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    website: {
      type: String,
      required: true,
      trim: true
    },
    contactCategory: {
      type: Schema.Types.ObjectId,
      ref: 'ContactCategory',
      required: true
    }
  },
  { timestamps: true }
);

export const ContactInfo = model<IContactInfo>("ContactInfo", contactInfoSchema);
