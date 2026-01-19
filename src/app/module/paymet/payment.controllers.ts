import { Request, Response } from "express";
import catchAsync from "../../sheard/catchAsync";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../sheard/sendResponse";
import { paymentServices } from "./payment.services";

const paymentInit = catchAsync(async (req: Request, res: Response) => {
  const bookingId = req.params.id;

  const result = await paymentServices.paymentinit(bookingId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: " all listing retrived success",
    data: result,
  });
});

const successpayment = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentServices.success();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: " all listing retrived success",
    data: result,
  });
});
const fail = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentServices.fail();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: " all listing retrived success",
    data: result,
  });
});
const cencel = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentServices.cencel();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: " all listing retrived success",
    data: result,
  });
});
export const pamentConroller = {
  paymentInit,
  successpayment,
  fail,
  cencel,
};
