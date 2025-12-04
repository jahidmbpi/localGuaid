import { Request, Response } from "express";
import catchAsync from "../../sheard/catchAsync";
import sendResponse from "../../sheard/sendResponse";
import { StatusCodes } from "http-status-codes";
import { guaidServices } from "./guaid.services";

const becomeGuaid = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const payload = req.body;

  const result = await guaidServices.becomeGuaid(user, payload);
  sendResponse(res, {
    success: true,
    message: "guaid profile creeate success",
    statusCode: StatusCodes.CREATED,
    data: result,
  });
});

export const guaidController = {
  becomeGuaid,
};
