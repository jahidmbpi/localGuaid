import { Request, Response } from "express";
import catchAsync from "../../sheard/catchAsync";
import sendResponse from "../../sheard/sendResponse";
import { StatusCodes } from "http-status-codes";
import { bookingServices } from "./booking.services";
import pick from "../../sheard/pick";

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const user = req.user;
  const listingId = req.params.id;
  const result = await bookingServices.createBooking(payload, user, listingId);
  sendResponse(res, {
    success: true,
    message: "booking create succsess",
    statusCode: StatusCodes.CREATED,
    data: result,
  });
});

const getALlbooking = catchAsync(async (req: Request, res: Response) => {
  const option = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const result = await bookingServices.getAllBooking(option);
  sendResponse(res, {
    success: true,
    message: "all booking retrived succsess",
    statusCode: StatusCodes.CREATED,
    data: result,
  });
});

const myBooking = catchAsync(async (req: Request, res: Response) => {
  const id = req.user.userId;
  const option = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const result = await bookingServices.myBooking(id, option);
  sendResponse(res, {
    success: true,
    message: "my booking retrived success",
    statusCode: StatusCodes.CREATED,
    data: result,
  });
});

export const bookingController = {
  createBooking,
  getALlbooking,
  myBooking,
};
