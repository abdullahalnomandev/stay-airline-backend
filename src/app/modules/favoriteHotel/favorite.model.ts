import { Schema, model } from "mongoose";
import { IFavoriteHotel } from "./favorite.interface";

const favoriteHotelSchema = new Schema<IFavoriteHotel>(
  {
    hotel: {
      type: Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true,
    },
    user: { 
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true 
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { 
    timestamps: true,
    toJSON: {
      virtuals: true
    }
  }
);

favoriteHotelSchema.index({ hotel: 1, user: 1 }, { unique: true });

export const FavoriteHotel = model<IFavoriteHotel>("FavoriteHotel", favoriteHotelSchema);
