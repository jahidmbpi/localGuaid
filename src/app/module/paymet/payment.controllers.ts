import { Request, Response } from "express";
import catchAsync from "../../sheard/catchAsync";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../sheard/sendResponse";
import { paymentServices } from "./payment.services";

const paymentInit = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentServices.paymentinit();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: " all listing retrived success",
    data: result,
  });
});

export const pamentConroller = {
  paymentInit,
};
