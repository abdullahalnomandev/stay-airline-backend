import { model, Schema } from 'mongoose';
import { FacilityModel, IFacility } from './facilities.interface';

const facilitySchema = new Schema<IFacility, FacilityModel>(
  {
    name: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

export const Facility = model<IFacility, FacilityModel>('Facility', facilitySchema);
