import { BookingStatus, PaymentStatus, UserStatus } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../config/prisma";
import AppError from "../../helper/appError";
import { StatusCodes } from "http-status-codes";
import { ICreateBooking } from "./booking.interface";
import { IPagination } from "../../interface/interface";
import calculatatePagination from "../../sheard/calculatePagination";
import { v4 as uuid } from "uuid";

const createBooking = async (
  payload: ICreateBooking,
  user: JwtPayload,
  listingId: string,
) => {
  const isExistGuide = await prisma.user.findUnique({
    where: { id: payload.guideId },
  });

  if (!isExistGuide) {
    throw new AppError(StatusCodes.NOT_FOUND, "Guide not found");
  }

  if (
    isExistGuide.status === UserStatus.BLOCK ||
    isExistGuide.status === UserStatus.INACTIVE
  ) {
    throw new AppError(StatusCodes.BAD_REQUEST, "This guide is not available");
  }

  const isExistListing = await prisma.listing.findFirst({
    where: { id: listingId, isActive: true },
  });

  if (!isExistListing) {
    throw new AppError(StatusCodes.NOT_FOUND, "Listing not available");
  }
  const tourist = await prisma.user.findUnique({
    where: {
      id: user.userId,
    },
  });
  if (!tourist) {
    throw new AppError(StatusCodes.NOT_FOUND, "Tourist not found");
  }

  if (!tourist.phone) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      " phone number is missing! please update your profile",
    );
  }
  if (!tourist.presentAddress || !tourist.parmanentAddress) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      " address is missing! please update your profile",
    );
  }

  const totalAmount = isExistListing.price * payload.groupSize;
  const transactionId = uuid();

  const result = await prisma.$transaction(async (tx) => {
    // ✅ 1️⃣ Create Booking
    const booking = await tx.booking.create({
      data: {
        startDate: payload.startDate,
        endDate: payload.endDate,
        listingId,
        guideId: payload.guideId,
        groupSize: payload.groupSize,
        touristId: user.userId,
        totalAmount,
        paymentStatus: PaymentStatus.UNPAID,
      },
    });

    // ✅ 2️⃣ Create Payment (UNPAID)
    const payment = await tx.payment.create({
      data: {
        bookingId: booking.id,
        transactionId,
        amount: booking.totalAmount,
        status: PaymentStatus.UNPAID,
      },
    });

    // ✅ 3️⃣ Update listing booking count
    await tx.listing.update({
      where: { id: listingId },
      data: {
        bookingCount: { increment: 1 },
      },
    });

    return {
      booking,
      payment,
    };
  });

  return result;
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

const confrimBooking = async (
  bookingId: string,
  payload: {
    status: "CENCELLED" | "CONFRIMED";
  },
) => {
  const isExistBooking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!isExistBooking) {
    throw new AppError(StatusCodes.NOT_FOUND, "Booking not found");
  }
  if (
    isExistBooking.status === BookingStatus.CENCELLED &&
    payload.status === "CENCELLED"
  ) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "This booking is already canceled",
    );
  }
  if (
    isExistBooking.status === BookingStatus.CONFRIMED &&
    payload.status === "CONFRIMED"
  ) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "This booking is already confirmed",
    );
  }
  const updateBooking = await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status: payload.status as BookingStatus,
    },
  });
  return updateBooking;
};

const turistBooking = async (id: string, option: IPagination) => {
  const { page, limit, skip, sortBy, sortOrder } =
    calculatatePagination(option);
  const reult = await prisma.booking.findMany({
    where: {
      touristId: id,
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
  confrimBooking,
  turistBooking,
};
