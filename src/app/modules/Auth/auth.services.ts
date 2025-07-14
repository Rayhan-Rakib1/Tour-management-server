import { StatusCodes } from "http-status-codes";
import AppError from "../../ErrorHandlers/AppError";
import { IUser } from "../User/user.interface";
import { User } from "../User/user.model";
import bcrypt from "bcryptjs";
import { generateToken } from "../../utils/jwt";
import { envVars } from "../../config/env";

const credentialLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User dose not exist");
  }

  const passwordMatched = await bcrypt.compare(
    password as string,
    isUserExist.password as string
  );

  if (!passwordMatched) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Password dose not matched");
  }

  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };
  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );

  return {
    accessToken,
  };
};

export const authService = {
  credentialLogin,
};
