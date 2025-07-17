import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../ErrorHandlers/AppError";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { User } from "../modules/User/user.model";
import { StatusCodes } from "http-status-codes";
import { IsActivated } from "../modules/User/user.interface";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) {
        throw new AppError(403, "Access token not found");
      }
      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;

      const isUserExist = await User.findOne({ email: verifiedToken.email });

      if (!isUserExist) {
        throw new AppError(StatusCodes.BAD_REQUEST, "User dose not exist");
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

      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(403, "You are not authorized");
      }

      req.user = verifiedToken;
      next();
    } catch (err) {
      next(err);
    }
  };
