import { Request, Response } from "express";
import sendResponse from "../../sheard/sendResponse";
import { StatusCodes } from "http-status-codes";
import { deshbordServices } from "./deshbord.services";
import catchAsync from "../../sheard/catchAsync";

const getDashboardMetaData = catchAsync(async (req: Request, res: Response) => {
  const result = await deshbordServices.getDashboardMetaData(req.user!);
  sendResponse(res, {
    success: true,
    message: "Dashboard metadata retrieved successfully",
    statusCode: StatusCodes.OK,
    data: result,
  });
});

export const deshbordController = {
  getDashboardMetaData,
};
