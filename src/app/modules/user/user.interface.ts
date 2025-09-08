import { Model, Types } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';
import { IairlinePersonVerification } from '../airlinePersonVerification/airlineVerification.interface';

export type IUser = {
  name: string;
  airlinePersonVerification?:Types.ObjectId | IairlinePersonVerification;
  role: USER_ROLES;
  contact: string;
  email: string;
  password: string;
  address: string;
  connectedAccountId: string;
  stripeConnectedLink: string;
  dateOfBirth:Date;
  images: string[];
  status: 'active' | 'delete';
  verified: boolean;
  authentication?: {
    isResetPassword: boolean;
    oneTimeCode: number;
    expireAt: Date;
  };
};

export type UserModal = {
  isExistUserById(id: string): any;
  isExistUserByEmail(email: string): any;
  isMatchPassword(password: string, hashPassword: string): boolean;
} & Model<IUser>;