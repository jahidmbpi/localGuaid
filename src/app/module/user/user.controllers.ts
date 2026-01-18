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
  const result = await userServices.updateUserById(req);
  sendResponse(res, {
    success: true,
    message: "user updated succesfully",
    statusCode: StatusCodes.OK,
    data: result,
  });
});

const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await userServices.getUserById(id);

    res.status(StatusCodes.OK).json({
      success: true,
      statusCode: StatusCodes.OK,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      statusCode: error.statusCode || 500,
      message: error.message || "Something went wrong",
    });
  }
};
export const userController = {
  createUser,
  getAllUser,
  updateUserById,
  getUserById,
};
