import { Request, Response } from "express";
import catchAsync from "../../sheard/catchAsync";
import sendResponse from "../../sheard/sendResponse";
import { StatusCodes } from "http-status-codes";
import { listingServices } from "./listing.services";

const createListing = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const payload = req.body;

  const files = req.files as Express.Multer.File[];
  const result = await listingServices.createListing(user, payload, files);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "listing create success",
    data: result,
  });
});
const getAllListing = catchAsync(async (req: Request, res: Response) => {
  const result = await listingServices.getAllLising();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: " all listing retrived success",
    data: result,
  });
});

const UpdateListing = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const listingId = req.params.id;
  const user = req.user;
  // const files = req.files as Express.Multer.File[];
  const result = await listingServices.UpdateListing(payload, listingId, user);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "listing update success",
    data: result,
  });
});
const deleteListing = catchAsync(async (req: Request, res: Response) => {
  const listingId = req.params.id;
  const user = req.user;
  const result = await listingServices.deleteListing(listingId, user);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "listing delete success",
    data: result,
  });
});
export const listingContorller = {
  createListing,
  UpdateListing,
  deleteListing,
  getAllListing,
};
