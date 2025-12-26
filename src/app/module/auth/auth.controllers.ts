import { Request, Response } from "express";
import catchAsync from "../../sheard/catchAsync";
import sendResponse from "../../sheard/sendResponse";
import { StatusCodes } from "http-status-codes";
import { authServices } from "./auth.services";
import { setCoockie } from "../../sheard/setCoockie";

const logInWithEmailAndPassword = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await authServices.logInWithEmailAndPassword(res, payload);

    sendResponse(res, {
      success: true,
      message: "login",
      statusCode: StatusCodes.CREATED,
      data: result,
    });
  }
);

const Me = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await authServices.Me(user);

  sendResponse(res, {
    success: true,
    message: "logedIn user retrived succesfully",
    statusCode: StatusCodes.OK,
    data: result,
  });
});
export const authController = {
  logInWithEmailAndPassword,
  Me,
};
