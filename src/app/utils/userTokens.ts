import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { IsActivated, IUser } from "../modules/User/user.interface";
import { generateToken, verifyToken } from "./jwt";
import { User } from "../modules/User/user.model";
import AppError from "../ErrorHandlers/AppError";
import { StatusCodes } from "http-status-codes";

export const  createToken = (user: Partial<IUser>) => {
    const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };
  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );

  const refreshToken = generateToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRES
  );

  return  {
    accessToken, refreshToken
  }

}

export const getNewAccessTokenUsingRefreshToken = async(refreshToken: string) => {
      const verifiedRefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload;

  const isUserExist = await User.findOne({ email: verifiedRefreshToken.email });
  
  if (!isUserExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User dose not exist");
  }
  if(isUserExist.isActivated === IsActivated.BLOCKED || isUserExist.isActivated === IsActivated.INACTIVE){
    throw new AppError(StatusCodes.BAD_REQUEST, `User is ${isUserExist.isActivated}`)
  }
  if(isUserExist.isDeleted){
    throw new AppError(StatusCodes.BAD_REQUEST, 'User is deleted')
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

  return accessToken
}