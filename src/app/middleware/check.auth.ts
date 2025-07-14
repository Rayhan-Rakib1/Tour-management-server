
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../ErrorHandlers/AppError";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";

export const checkAuth = (...authRoles: string[]) => (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization;
        if(!accessToken){
            throw new AppError(403, "Access token not found")
        }
        const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload

      if(!authRoles.includes(verifiedToken.role)){
        throw new AppError( 403,'You are not authorized')
      }

        req.user = verifiedToken;
        next();
    } catch (err) {
        next(err);
    }
}