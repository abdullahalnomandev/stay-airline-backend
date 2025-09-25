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
import { userSearchableField } from './user.constant';

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
  const existingUser = await User.findById(userId).populate({
    path: 'airlineVerification',
    match: { paymentStatus: "paid" },
    populate: {
      path: 'plan',
      select: '-active'
    },
    select: 'designation plan employeeId images paymentStatus paymentMethod'
  });
  if (!existingUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  return existingUser;
};

const updateProfileToDB = async (
  user: JwtPayload,
  payload: Partial<IUser>
): Promise<Partial<IUser | null>> => {
  const { id } = user;
  const isExistUser = await User.findById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //unlink file here
  if (payload.images) {
    unlinkFiles(isExistUser.images);
  }

  if (payload.profilePic) {
    unlinkFile(isExistUser.profilePic);
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

  // console.log({userId,payload})


  const isExistUser = await User.isExistUserById(userId);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //unlink file here
  if (payload) {
    if (isExistUser.images && isExistUser.images.length > 0) {
      unlinkFiles(isExistUser.images);
    }
    if (isExistUser.profilePic) {
      unlinkFile(isExistUser.profilePic);
    }
  }
  const updateDoc = await User.findOneAndUpdate({ _id: userId }, payload, {
    new: true,
  });

  return updateDoc;
};

const getAllUsers = async (query: Record<string, any>) => {
  const result = new QueryBuilder(User.find(), query)
    .paginate()
    .search(userSearchableField)
    .fields()
    .filter()
    .sort();

  const data = await result.modelQuery
    .populate({
      path: "airlineVerification",
      match: { paymentStatus: "paid" },
      select: "designation plan employeeId images paymentStatus paymentMethod",
      populate: {
        path: "plan",
        select: "-active",
      },
    })
    .lean();

  const pagination = await result.getPaginationInfo();

  return {
    pagination,
    data,
  };
};

const deleteUserFromDB = async (
  userId: string
): Promise<Partial<IUser | null>> => {
  const isExistUser = await User.isExistUserById(userId);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //unlink file here
  if (isExistUser.logo) {
    unlinkFiles(isExistUser.logo);
  }
  if (isExistUser.profilePic) {
    unlinkFile(isExistUser.profilePic);
  }

  // Toggle user status between active and block
  const newStatus = isExistUser.status === 'active' ? 'block' : 'active';
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { status: newStatus },
    { new: true }
  );
  
  return updatedUser;
};

const verifyHost = async (
  userId: string
): Promise<Partial<IUser | null>> => {
  const isExistUser = await User.isExistUserById(userId);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //unlink file here
  if (isExistUser.logo) {
    unlinkFiles(isExistUser.logo);
  }
  if (isExistUser.profilePic) {
    unlinkFile(isExistUser.profilePic);
  }

  // Toggle isVerifiedHost between true and false
  const newVerificationStatus = isExistUser.isVerifiedHost ? false : true;
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { isVerifiedHost: newVerificationStatus },
    { new: true }
  );
  
  return updatedUser;
};

const getAllHost = async (query: Record<string, any>) => {

  query.role = 'host';
  const result = new QueryBuilder(User.find(), query)
    .paginate()
    .search(userSearchableField)
    .fields()
    .filter()
    .sort();

  const data = await result.modelQuery
    .populate({
      path: "airlineVerification",
      match: { paymentStatus: "paid" },
      select: "designation employeeId",
      // populate: {
      //   path: "plan",
      //   select: "-active",
      // },
    })
    .lean();

  const pagination = await result.getPaginationInfo();

  return {
    pagination,
    data,
  };
};
export const UserService = {
  createUserToDB,
  getUserProfileFromDB,
  updateProfileToDB,
  createNewUserToDB,
  getAllUsers,
  updateUserToDB,
  deleteUserFromDB,
  verifyHost,
  getAllHost
}; createNewUserToDB