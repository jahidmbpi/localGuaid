import { Request, Response } from "express";
import catchAsync from "../../sheard/catchAsync";
import sendResponse from "../../sheard/sendResponse";
import { StatusCodes } from "http-status-codes";
import { wishlistServices } from "./wishlist.services";

const addToWishlist = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const { listingId } = req.body;

  const result = await wishlistServices.addToWishlist(userId, listingId);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Listing added to wishlist successfully",
    data: result,
  });
});

const removeFromWishlist = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const { listingId } = req.params;

  const result = await wishlistServices.removeFromWishlist(userId, listingId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Listing removed from wishlist successfully",
    data: result,
  });
});

const getMyWishlist = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;

  const result = await wishlistServices.getMyWishlist(userId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "My wishlist retrieved successfully",
    data: result,
  });
});

export const wishlistController = {
  addToWishlist,
  removeFromWishlist,
  getMyWishlist,
};
