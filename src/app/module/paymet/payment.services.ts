import { v4 as uuid } from "uuid";

import { prisma } from "../../config/prisma";
import AppError from "../../helper/appError";
import { StatusCodes } from "http-status-codes";

import { sslService } from "../../sslcommarz/sslcommarze.services";

const paymentinit = async (bookingId: string) => {
  console.log(bookingId);
  const isExsistBokking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
  });
  console.log(isExsistBokking);
  const turist = await prisma.user.findUnique({
    where: {
      id: isExsistBokking?.touristId,
    },
  });
  console.log("this is turist", turist);

  if (!isExsistBokking) {
    throw new AppError(StatusCodes.NOT_FOUND, "Booking not found");
  }

  if (!turist) {
    throw new AppError(StatusCodes.NOT_FOUND, "Tourist not found");
  }

  const isExsitpayment = await prisma.payment.findUnique({
    where: {
      bookingId,
    },
  });
  if (!isExsitpayment) {
    throw new AppError(StatusCodes.NOT_FOUND, "Tourist not found");
  }
  if (!isExsitpayment.transactionId) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Transaction ID missing",
    );
  }

  const ssldata = {
    amount: isExsistBokking.totalAmount,
    transactionId: isExsitpayment.transactionId,
    name: turist.name,
    email: turist.email,
    phoneNumber: turist.phone || "",
    address: turist.presentAddress || "",
  };
  const sslpayment = await sslService.paymentInit(ssldata);

  return {
    paymentUrl: sslpayment.GatewayPageURL,
  };
};

const success = async () => {
  console.log("this is success");
};
const fail = async () => {
  console.log("this is fail");
};
const cencel = async () => {
  console.log("this is cencel");
};

export const paymentServices = {
  paymentinit,
  success,
  fail,
  cencel,
};
