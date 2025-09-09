import { Schema, model } from "mongoose";
import { IReview } from "./review.interface";

const reviewSchema = new Schema<IReview>(
  {
    hotel:{
      type:Schema.Types.ObjectId,
      ref:'Hotel',
      required:false,
    },
    content: { type: String, required: true, trim: true },
    user: { 
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true 
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Review = model<IReview>("Review", reviewSchema);