import { Request, Response } from "express";
import catchAsync from "../../sheard/catchAsync";
import sendResponse from "../../sheard/sendResponse";
import { StatusCodes } from "http-status-codes";
import { authServices } from "./auth.services";

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
  },
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

const logout = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie("accessTocken", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });
  res.clearCookie("refreshTocken", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });

  sendResponse(res, {
    success: true,
    message: "Logged out successfully",
    statusCode: StatusCodes.OK,
    data: null,
  });
});

export const authController = {
  logInWithEmailAndPassword,
  Me,
  logout,
};
