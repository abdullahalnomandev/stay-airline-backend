import { Schema, model } from "mongoose";
import { IContactCategory } from "./contactCategory.interfac";

const contactCategorySchema = new Schema<IContactCategory>(
  {
    title: { 
      type: String, 
      required: true, 
      trim: true 
    }
  },
  { timestamps: true }
);

export const ContactCategory = model<IContactCategory>("ContactCategory", contactCategorySchema);
