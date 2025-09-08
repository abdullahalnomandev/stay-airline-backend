import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLES } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { emailHelper } from '../../../helpers/emailHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import unlinkFile, { unlinkFiles } from '../../../shared/unlinkFile';
import generateOTP from '../../../util/generateOTP';
import { IUser } from './user.interface';
import { User } from './user.model';
import QueryBuilder from '../../builder/QueryBuilder';

const createUserToDB = async (payload: Partial<IUser>): Promise<{ message: string }> => {
  //set role
  payload.role = USER_ROLES.GUEST;
  const createUser = await User.create(payload);
  if (!createUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create user');
  }

  //send email
  const otp = generateOTP();
  const values = {
    name: createUser.name,
    otp: otp,
    email: createUser.email!,
  };
  const createAccountTemplate = emailTemplate.createAccount(values);
  emailHelper.sendEmail(createAccountTemplate);

  //save to DB
  const authentication = {
    oneTimeCode: otp,
    expireAt: new Date(Date.now() + 3 * 60000),
  };
  await User.findOneAndUpdate(
    { _id: createUser._id },
    { $set: { authentication } }
  );

  return { message: "User created successfully" };
};

const getUserProfileFromDB = async (
  userId: string
): Promise<Partial<IUser>> => {
  const isExistUser = await User.isExistUserById(userId);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  return isExistUser;
};

const updateProfileToDB = async (
  user: JwtPayload,
  payload: Partial<IUser>
): Promise<Partial<IUser | null>> => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //unlink file here
  if (payload.images) {
    unlinkFile(isExistUser.image);
  }

  const updateDoc = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return updateDoc;
};
const createNewUserToDB = async (
  payload: Partial<IUser>
): Promise<Partial<IUser | null>> => {

  const createUser = await User.create(payload);
  if (!createUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create user');
  }

  //send email
  const otp = generateOTP();
  const values = {
    name: createUser.name,
    otp: otp,
    email: createUser.email!,
  };
  console.log({ values })
  const createAccountTemplate = emailTemplate.createAccount(values);
  emailHelper.sendEmail(createAccountTemplate);

  //save to DB
  const authentication = {
    oneTimeCode: otp,
    expireAt: new Date(Date.now() + 3 * 60000),
  };
  await User.findOneAndUpdate(
    { _id: createUser._id },
    { $set: { authentication } }
  );

  return createUser;
};

const updateUserToDB = async (
  userId: string,
  payload: Partial<IUser>
): Promise<Partial<IUser | null>> => {


  const isExistUser = await User.isExistUserById(userId);
  console.log({payload})
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //unlink file here
  if (payload) {
    unlinkFiles(isExistUser.images);
  }

  const updateDoc = await User.findOneAndUpdate({ _id: userId }, payload, {
    new: true,
  });

  return updateDoc;
};

const getAllUsers = async (query: Record<string, any>) => {
  const result = new QueryBuilder(User.find(), query).paginate()
    .search(['name', 'email'])
    .fields()
    .filter()
    .sort()

  const data = await result.modelQuery;
  const pagination = await result.getPaginationInfo();

  return {
    pagination,
    data
  };
}

export const UserService = {
  createUserToDB,
  getUserProfileFromDB,
  updateProfileToDB,
  createNewUserToDB,
  getAllUsers,
  updateUserToDB
};
