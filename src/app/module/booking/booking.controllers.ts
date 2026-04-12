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
    statusCode: StatusCodes.OK,
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
    statusCode: StatusCodes.OK,
    data: result,
  });
});

const updateBooking = catchAsync(async (req: Request, res: Response) => {
  const bookingId = req.params.id;
  const payload = req.body;
  console.log(payload);
  const result = await bookingServices.updateBooking(bookingId, payload);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "booking updated success",
    data: result,
  });
});

const turistBooking = catchAsync(async (req: Request, res: Response) => {
  const id = req.user.userId;
  const option = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const result = await bookingServices.turistBooking(id, option);
  sendResponse(res, {
    success: true,
    message: "turist booking retrived success",
    statusCode: StatusCodes.OK,
    data: result,
  });
});

const upcomingBokking = catchAsync(async (req: Request, res: Response) => {
  const id = req.user.userId;
  const result = await bookingServices.upcimingBooking(id);
  sendResponse(res, {
    success: true,
    message: "guaid confrimed booking retrived success",
    statusCode: StatusCodes.OK,
    data: result,
  });
});

export const bookingController = {
  createBooking,
  getALlbooking,
  myBooking,
  updateBooking,
  turistBooking,
  upcomingBokking,
};
