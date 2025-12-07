import { BookingStatus, PaymentStatus, UserStatus } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../config/prisma";
import AppError from "../../helper/appError";
import { StatusCodes } from "http-status-codes";
import { ICreateBooking } from "./booking.interface";
import { IPagination } from "../../interface/interface";
import calculatatePagination from "../../sheard/calculatePagination";

const createBooking = async (
  payload: ICreateBooking,
  user: JwtPayload,
  listingId: string
) => {
  const isExistGuid = await prisma.user.findUnique({
    where: {
      id: payload.guideId,
    },
  });
  if (!isExistGuid) {
    throw new AppError(StatusCodes.NOT_FOUND, "guaid not found");
  }
  if (
    isExistGuid.status === UserStatus.BLOCK ||
    isExistGuid.status === UserStatus.INACTIVE
  ) {
    throw new AppError(StatusCodes.BAD_REQUEST, "This guide is not available");
  }

  const isExistListing = await prisma.listing.findFirst({
    where: {
      id: listingId,
      isActive: true,
    },
  });
  if (!isExistListing) {
    throw new AppError(StatusCodes.NOT_FOUND, "listing not found");
  }
  if (isExistListing.isActive === false) {
    throw new AppError(StatusCodes.NOT_FOUND, "listing not  aviable now ");
  }

  const totalamount = isExistListing.price * payload.groupSize;
  console.log(totalamount);

  const bookingData = {
    startDate: payload.startDate,
    endDate: payload.endDate,
    listingId: listingId,
    guideId: payload.guideId,
    groupSize: payload.groupSize,
    touristId: user.userId,
    totalAmount: totalamount,
    paymentStatus: PaymentStatus.UNPAID,
  };
  const createBooking = await prisma.booking.create({
    data: bookingData,
  });
  return createBooking;
};

const getAllBooking = async (option: IPagination) => {
  const { page, limit, skip, sortBy, sortOrder } =
    calculatatePagination(option);

  const result = await prisma.booking.findMany({
    take: limit,
    skip,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });
  const total = await prisma.booking.count();
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const myBooking = async (id: string, option: IPagination) => {
  const { page, limit, skip, sortBy, sortOrder } =
    calculatatePagination(option);
  const reult = await prisma.booking.findMany({
    where: {
      guideId: id,
      status: BookingStatus.PENDING,
    },
    take: limit,
    skip,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });
  const total = await prisma.booking.count();
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: reult,
  };
};

export const bookingServices = {
  createBooking,
  getAllBooking,
  myBooking,
};
