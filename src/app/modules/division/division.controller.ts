import { Request, Response } from "express";
import { divisionServices } from "./division.services";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";

const createDivision = catchAsync(async (req: Request, res: Response) => {
  const result = await divisionServices.createDivision(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Division created",
    data: result,
  });
});

const getAllDivision = catchAsync(async (req: Request, res: Response) => {
  const result = await divisionServices.getAllDivision();
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "All division",
    data: result.data,
    meta: result.meta,
  });
});

const getSingleDivision = catchAsync(async (req: Request, res: Response) => {
  const result = await divisionServices.getSingleDivision(req.params.slug);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Division retrieved",
    data: result.data,
  });
});

const updatedDivision = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await divisionServices.updateDivision(id, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Updated division",
    data: result,
  });
});

const deleteDivision = catchAsync(async (req: Request, res: Response) => {
  const result = await divisionServices.deleteDivision(req.params.id);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Division deleted",
    data: result,
  });
});

export const divisionController = {
  createDivision,
  getAllDivision,
  getSingleDivision,
  deleteDivision,
  updatedDivision,
};
