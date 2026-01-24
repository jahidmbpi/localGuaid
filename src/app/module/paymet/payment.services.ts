import { v4 as uuid } from "uuid";

import { prisma } from "../../config/prisma";
import AppError from "../../helper/appError";
import { StatusCodes } from "http-status-codes";

import { sslService } from "../../sslcommarz/sslcommarze.services";
import { BookingStatus, PaymentStatus } from "@prisma/client";

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

const success = async (transactionId: string, validId: string) => {
  console.log("this is success");
  console.log(transactionId);
  const validateresponse = await sslService.validatePyment(validId);
  console.log(validateresponse, "validate response from services");

  const payment = await prisma.payment.findFirst({
    where: {
      transactionId,
    },
  });

  if (!payment) {
    throw new AppError(404, "Payment not found");
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedPayment = await tx.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        status: PaymentStatus.PAID,
      },
    });

    const updatedBooking = await tx.booking.update({
      where: {
        id: payment.bookingId,
      },
      data: {
        status: BookingStatus.COMPLETED,
      },
    });

    return {
      payment: updatedPayment,
      booking: updatedBooking,
    };
  });
  return {
    success: true,
    message: "Payment completed successfully",
    data: result,
  };
};

const fail = async (transactionId: string) => {
  const payment = await prisma.payment.findFirst({
    where: {
      transactionId: transactionId,
    },
  });

  if (!payment) {
    throw new AppError(404, "Payment not found");
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedPayment = await tx.payment.update({
      where: { id: payment.id },
      data: { status: PaymentStatus.UNPAID },
    });

    const updatedBooking = await tx.booking.update({
      where: { id: payment.bookingId },
      data: { status: BookingStatus.CENCELLED },
    });

    return { updatedPayment, updatedBooking };
  });

  return {
    success: false,
    message: "Payment failedS",
    data: result,
  };
};

const cencel = async (transactionId: string) => {
  const payment = await prisma.payment.findFirst({
    where: {
      transactionId: transactionId,
    },
  });

  if (!payment) {
    throw new AppError(404, "Payment not found");
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedPayment = await tx.payment.update({
      where: { id: payment.id },
      data: { status: PaymentStatus.UNPAID },
    });

    const updatedBooking = await tx.booking.update({
      where: { id: payment.bookingId },
      data: { status: BookingStatus.CENCELLED },
    });

    return { updatedPayment, updatedBooking };
  });

  return {
    success: false,
    message: "Payment cencel successfully",
    data: result,
  };
};

export const paymentServices = {
  paymentinit,
  success,
  fail,
  cencel,
};
