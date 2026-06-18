import { Request, Response } from "express";
import catchAsync from "../../sheard/catchAsync";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../sheard/sendResponse";
import { paymentServices } from "./payment.services";
import { envVars } from "../../config/env";

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
  const transectionId = String(req.query.transactionId);
  const valId = req.body.val_id;
  console.log(valId, "this is validate id from ssl");

  await paymentServices.success(transectionId, valId);
  res.redirect(`${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${transectionId}`);
});

const fail = catchAsync(async (req: Request, res: Response) => {
  const transectionId = String(req.query.transactionId);
  await paymentServices.fail(transectionId);
  res.redirect(`${envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${transectionId}`);
});

const cencel = catchAsync(async (req: Request, res: Response) => {
  const transectionId = String(req.query.transactionId);
  await paymentServices.cencel(transectionId);
  res.redirect(`${envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${transectionId}`);
});

export const pamentConroller = {
  paymentInit,
  successpayment,
  fail,
  cencel,
};
