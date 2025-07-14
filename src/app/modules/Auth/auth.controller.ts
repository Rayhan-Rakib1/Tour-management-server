import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { authService } from "./auth.services";

const credentialLogin  = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
const authInfo = await authService.credentialLogin(req.body);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "User login successfully",
      data: authInfo,
    });
  }
);

export const authController = {
    credentialLogin
}