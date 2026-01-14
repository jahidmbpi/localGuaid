import { Request, Response } from "express";
import sendResponse from "../../sheard/sendResponse";
import { StatusCodes } from "http-status-codes";
import { userServices } from "./user.services";
import catchAsync from "../../sheard/catchAsync";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createUser(req);
  sendResponse(res, {
    success: true,
    message: "user created successfuly",
    statusCode: StatusCodes.CREATED,
    data: result,
  });
});

const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.getAllUser();
  sendResponse(res, {
    success: true,
    message: "all user retrived success",
    statusCode: StatusCodes.OK,
    data: result,
  });
});
const updateUserById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const user = req.user;
  const payload = req.body;
  const file = req.file;

  const result = await userServices.updateUserById(id, user, payload, file);
  sendResponse(res, {
    success: true,
    message: "user updated succesfully",
    statusCode: StatusCodes.OK,
    data: result,
  });
});
export const userController = {
  createUser,
  getAllUser,
  updateUserById,
};
