import { Model } from 'mongoose';

export type IFacility = {
  name: string;
  logo: string;
};

export type FacilityModel = {
  isExistFacilityById(id: string): Promise<boolean>;
  isExistFacilityByName(name: string): Promise<boolean>;
} & Model<IFacility>;
