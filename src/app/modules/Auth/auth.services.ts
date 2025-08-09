/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { StatusCodes } from "http-status-codes";
import AppError from "../../ErrorHandlers/AppError";
import { User } from "../User/user.model";
import bcrypt from "bcryptjs";
import { getNewAccessTokenUsingRefreshToken } from "../../utils/userTokens";
import jwt,{ JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import { IAuthProvider, IsActivated } from "../User/user.interface";
import { sendEmail } from "../../utils/sendEmail";

// const credentialLogin = async (payload: Partial<IUser>) => {
//   const { email, password } = payload;

//   const isUserExist = await User.findOne({ email });
//   if (!isUserExist) {
//     throw new AppError(StatusCodes.BAD_REQUEST, "User dose not exist");
//   }

//   const passwordMatched = await bcrypt.compare(
//     password as string,
//     isUserExist.password as string
//   );

//   if (!passwordMatched) {
//     throw new AppError(StatusCodes.BAD_REQUEST, "Password dose not matched");
//   }

//   const userTokens = createToken(isUserExist);

//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const { password: pass, ...rest } = isUserExist.toObject();

//   return {
//     accessToken: userTokens.accessToken,
//     refreshToken: userTokens.refreshToken,
//     user: rest,
//   };
// };

// ----------------------------------------------------------------------------------------------------
const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await getNewAccessTokenUsingRefreshToken(refreshToken);
  return {
    accessToken: newAccessToken,
  };
};

// -----------------------------------------
const changePassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken.userId);

  const isOldPassword = await bcrypt.compare(
    oldPassword,
    user!.password as string
  );
  if (!isOldPassword) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Enter your old password");
  }

  user!.password = await bcrypt.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );
  user!.save();
};

const resetPassword = async (
  decodedToken: JwtPayload,
  payload: Record<string, any>
) => {
  if (payload.id != decodedToken.userId) {
    throw new AppError(401, "You can not reset your password");
  }
  const isUserExist = await User.findById(decodedToken.userId);

  if (!isUserExist) {
    throw new AppError(401, "user does not exist");
  }

  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );
  isUserExist.password = hashedPassword;

  isUserExist!.save();
};

const setPassword = async (userId: string, plainPassword: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User not found");
  }

  if (
    user.password &&
    user.auths.some((providerObjects) => providerObjects.provider === "google")
  ) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "You have already set you password. Now you can change the password from your profile password update"
    );
  }

  const hashedPassword = await bcrypt.hash(
    plainPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const credentialProvider: IAuthProvider = {
    provider: "credential",
    providerId: user.email,
  };
  const auths: IAuthProvider[] = [...user.auths, credentialProvider];

  user.password = hashedPassword;
  user.auths = auths;
  user!.save();
};

const forgetPassword = async (email: string) => {
  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User does not exist");
  }
  if (!isUserExist.isVerified) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User is not verified");
  }
  if (
    isUserExist.isActivated === IsActivated.BLOCKED ||
    isUserExist.isActivated === IsActivated.INACTIVE
  ) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `User is ${isUserExist.isActivated}`
    );
  }
  if (isUserExist.isDeleted) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User is deleted");
  }

  const JwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role
  }

  const resetToken = jwt.sign(JwtPayload, envVars.JWT_ACCESS_SECRET, {expiresIn: "10min"})

   const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`

   sendEmail({
    to: isUserExist.email,
    subject: "password reset",
    templateName: "forgetPassword",
    templateData: {
      name: isUserExist.name,
      resetUILink
    }
   })
};

export const authService = {
  // credentialLogin,
  getNewAccessToken,
  changePassword,
  setPassword,
  resetPassword,
  forgetPassword,
};
