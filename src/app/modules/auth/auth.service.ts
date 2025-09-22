import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { emailHelper } from '../../../helpers/emailHelper';
import { jwtHelper } from '../../../helpers/jwtHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import {
  IAuthResetPassword,
  IChangePassword,
  ILoginData,
  IVerifyEmail,
} from '../../../types/auth';
import cryptoToken from '../../../util/cryptoToken';
import generateOTP from '../../../util/generateOTP';
import { User } from '../user/user.model';
import { AirlinePersonVerification } from '../airlinePersonVerification/airlinePersonVerificaiton.model';
import { USER_ROLES } from '../../../enums/user';

//login
const loginUserFromDB = async (payload: ILoginData) => {
  const { email, password } = payload;
  const isExistUser = await User.findOne({ email }).select('+password');
  
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //check verified and status
  if (!isExistUser.verified) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Please verify your account, then try to login again'
    );
  }

  const isUserVerified = await AirlinePersonVerification.findOne({email:payload.email,paymentStatus:'paid'});
  
  if (!isUserVerified && isExistUser.role !== USER_ROLES.ADMIN && isExistUser.role !== USER_ROLES.SUPER_ADMIN) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Please verify your airline account, then try to login again'
    );
  }

  //check user status
  if (isExistUser.status === 'block') {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'You don’t have permission to access this content.It looks like your account has been blocked.'
    );
  }

  //check match password
  if (
    password &&
    !(await User.isMatchPassword(password, isExistUser.password))
  ) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Password is incorrect!');
  }

  //create token
  const createToken = jwtHelper.createToken(
    { id: isExistUser._id, role: isExistUser.role, email: isExistUser.email },
    config.jwt.jwt_secret as Secret,
    config.jwt.jwt_expire_in as string
  );

  return { createToken };
};

//forget password
const forgetPasswordToDB = async (email: string) => {
  const isExistUser = await User.isExistUserByEmail(email);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //send mail
  const createResetToken = jwtHelper.createToken(
    { id: isExistUser._id, email: isExistUser.email },
    config.jwt.jwt_secret as Secret,
    '2m'
  );
  const value = {
    resetLink: `${config.frontend_url}/reset-password?token=${createResetToken}`,
    email: isExistUser.email,
  };
  const forgetPassword = emailTemplate.resetPassword(value);
  emailHelper.sendEmail(forgetPassword);
};

//verify email
const verifyEmailToDB = async (payload: IVerifyEmail) => {
  const { email, oneTimeCode } = payload;
  const isExistUser = await User.findOne({ email })
    .select('+authentication')
    .lean()
    .exec();
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  if (!oneTimeCode) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Please give the otp, check your email we send a code'
    );
  }

  if (isExistUser.authentication?.oneTimeCode !== oneTimeCode) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'You provided wrong otp');
  }

  const date = new Date();
  if (date > isExistUser.authentication?.expireAt) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Otp already expired, Please try again'
    );
  }

  let message;
  let data;

  if (!isExistUser.verified) {
    await User.findOneAndUpdate(
      { _id: isExistUser._id },
      { verified: true, authentication: { oneTimeCode: null, expireAt: null } }
    );
    message = 'Email verify successfully';
  } else {
    await User.findOneAndUpdate(
      { _id: isExistUser._id },
      {
        authentication: {
          isResetPassword: true,
          oneTimeCode: null,
          expireAt: null,
        },
      }
    );

    //create token ;
    const createToken = cryptoToken();
    message =
      'Verification Successful: Please securely store and utilize this code for reset password';
    data = createToken;
  }
  return { data, message };
};

//reset password
const resetPasswordToDB = async (payload: IAuthResetPassword) => {
  const { newPassword, confirmPassword, token } = payload;

  if (!token) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Reset token is required');
  }
  // verify token without throwing
  const decodedUser = jwtHelper.verifyToken(
    token,
    config.jwt.jwt_secret as Secret
  ) as { id: string } | null;

  if (!decodedUser) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Token has expired or is invalid'
    );
  }

  // check user exists
  const isExistUser = await User.findById(decodedUser.id)
    .select('_id password')
    .lean();
  if (!isExistUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }

  if (newPassword !== confirmPassword) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'New password and confirm password do not match'
    );
  }

  // hash new password
  const hashPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  // update user password
  await User.findByIdAndUpdate(
    decodedUser.id,
    {
      password: hashPassword,
      'authentication.isResetPassword': false,
    },
    { new: true }
  );

  return { message: 'Password reset successful' };
};

const changePasswordToDB = async (
  user: JwtPayload,
  payload: IChangePassword
) => {
  const { currentPassword, newPassword, confirmPassword } = payload;
  const isExistUser = await User.findById(user.id).select('+password');
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //current password match
  if (
    currentPassword &&
    !(await User.isMatchPassword(currentPassword, isExistUser.password))
  ) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Password is incorrect');
  }

  //newPassword and current password
  if (currentPassword === newPassword) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Please give different password from current password'
    );
  }
  //new password and confirm password check
  if (newPassword !== confirmPassword) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Password and Confirm password doesn't matched"
    );
  }

  //hash password
  const hashPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  const updateData = {
    password: hashPassword,
  };
  await User.findOneAndUpdate({ _id: user.id }, updateData, { new: true });
};

const resendOtpToDB = async (email: string) => {
  //set role
  const registedUser = await User.findOne({email},'email verified').lean()

  if(registedUser?.verified){
    throw new ApiError(StatusCodes.BAD_REQUEST, 'User already verified');
  }

  if (!registedUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'User not found');
  }

  //send email
  const otp = generateOTP();
  const values = {
    name: registedUser.name,
    otp: otp,
    email: registedUser.email!,
  };
  const createAccountTemplate = emailTemplate.createAccount(values);
  emailHelper.sendEmail(createAccountTemplate);

  //save to DB
  const authentication = {
    oneTimeCode: otp,
    expireAt: new Date(Date.now() + 3 * 60000),
  };
  await User.findOneAndUpdate(
    { _id: registedUser._id },
    { $set: { authentication } }
  );

  return { message: 'Otp resend successfully' };
};

export const AuthService = {
  verifyEmailToDB,
  loginUserFromDB,
  forgetPasswordToDB,
  resetPasswordToDB,
  changePasswordToDB,
  resendOtpToDB,
};
