import { Request, Response } from "express";
import catchAsync from "../../sheard/catchAsync";
import sendResponse from "../../sheard/sendResponse";
import { StatusCodes } from "http-status-codes";
import { listingServices } from "./listing.services";

const createListingHandler = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const payload = req.body;
  console.log("from controller", payload);
  const files = req.files as Express.Multer.File[];
  const result = await listingServices.createListing(user, payload, files);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "listing create success",
    data: result,
  });
});

export const listingContorller = {
  createListing: createListingHandler,
};
