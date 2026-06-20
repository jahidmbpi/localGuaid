"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentServices = void 0;
const prisma_1 = require("../../config/prisma");
const appError_1 = __importDefault(require("../../helper/appError"));
const http_status_codes_1 = require("http-status-codes");
const sendEmail_1 = require("../../helper/sendEmail");
const sslcommarze_services_1 = require("../../sslcommarz/sslcommarze.services");
const client_1 = require("@prisma/client");
const paymentinit = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(bookingId, "from payment");
    const isExsistBokking = yield prisma_1.prisma.booking.findUnique({
        where: {
            id: bookingId,
        },
    });
    console.log(isExsistBokking);
    if (!isExsistBokking) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Booking not found");
    }
    const turist = yield prisma_1.prisma.user.findUnique({
        where: {
            id: isExsistBokking.touristId,
        },
    });
    console.log("this is turist", turist);
    if (!turist) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Tourist not found");
    }
    const isExsitpayment = yield prisma_1.prisma.payment.findUnique({
        where: {
            bookingId,
        },
    });
    if (!isExsitpayment) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Payment not found");
    }
    if (!isExsitpayment.transactionId) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Transaction ID missing");
    }
    const ssldata = {
        amount: isExsistBokking.totalAmount,
        transactionId: isExsitpayment.transactionId,
        name: turist.name,
        email: turist.email,
        phoneNumber: turist.phone || "",
        address: turist.presentAddress || "",
    };
    const sslpayment = yield sslcommarze_services_1.sslService.paymentInit(ssldata);
    return {
        paymentUrl: sslpayment.GatewayPageURL,
    };
});
const success = (transactionId, validId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    console.log("this is success");
    console.log(transactionId);
    const validateresponse = yield sslcommarze_services_1.sslService.validatePyment(validId);
    console.log(validateresponse, "validate response from services");
    const payment = yield prisma_1.prisma.payment.findFirst({
        where: {
            transactionId,
        },
        include: {
            booking: {
                include: {
                    Tourist: true,
                    listing: true,
                },
            },
        },
    });
    if (!payment) {
        throw new appError_1.default(404, "Payment not found");
    }
    const result = yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const updatedPayment = yield tx.payment.update({
            where: {
                id: payment.id,
            },
            data: {
                status: client_1.PaymentStatus.PAID,
            },
        });
        const updatedBooking = yield tx.booking.update({
            where: {
                id: payment.bookingId,
            },
            data: {
                status: client_1.BookingStatus.COMPLETED,
                paymentStatus: client_1.PaymentStatus.PAID,
            },
        });
        return {
            payment: updatedPayment,
            booking: updatedBooking,
        };
    }));
    // Send success email to tourist asynchronously
    if ((_b = (_a = payment.booking) === null || _a === void 0 ? void 0 : _a.Tourist) === null || _b === void 0 ? void 0 : _b.email) {
        const emailSubject = "Booking Completed Successfully!";
        const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #2563eb; text-align: center;">Booking Confirmation</h2>
        <p>Dear ${payment.booking.Tourist.name || "Valued Tourist"},</p>
        <p>Your payment for the tour <strong>"${payment.booking.listing.title}"</strong> has been successfully processed!</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Booking ID:</strong> ${payment.booking.id}</p>
          <p style="margin: 5px 0;"><strong>Amount Paid:</strong> ৳ ${payment.booking.totalAmount}</p>
          <p style="margin: 5px 0;"><strong>Start Date:</strong> ${new Date(payment.booking.startDate).toLocaleDateString()}</p>
          <p style="margin: 5px 0;"><strong>End Date:</strong> ${new Date(payment.booking.endDate).toLocaleDateString()}</p>
        </div>
        <p>Thank you for choosing LocalGuide. Have an amazing trip!</p>
        <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #6b7280; text-align: center;">
          This is an automated email from LocalGuide Tourism Platform. Please do not reply directly to this email.
        </p>
      </div>
    `;
        (0, sendEmail_1.sendEmail)(payment.booking.Tourist.email, emailSubject, emailHtml);
    }
    return {
        success: true,
        message: "Payment completed successfully",
        data: result,
    };
});
const fail = (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield prisma_1.prisma.payment.findFirst({
        where: {
            transactionId: transactionId,
        },
    });
    if (!payment) {
        throw new appError_1.default(404, "Payment not found");
    }
    const result = yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const updatedPayment = yield tx.payment.update({
            where: { id: payment.id },
            data: { status: client_1.PaymentStatus.UNPAID },
        });
        const updatedBooking = yield tx.booking.update({
            where: { id: payment.bookingId },
            data: { status: client_1.BookingStatus.CANCELLED },
        });
        return { updatedPayment, updatedBooking };
    }));
    return {
        success: false,
        message: "Payment failedS",
        data: result,
    };
});
const cencel = (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield prisma_1.prisma.payment.findFirst({
        where: {
            transactionId: transactionId,
        },
    });
    if (!payment) {
        throw new appError_1.default(404, "Payment not found");
    }
    const result = yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const updatedPayment = yield tx.payment.update({
            where: { id: payment.id },
            data: { status: client_1.PaymentStatus.UNPAID },
        });
        const updatedBooking = yield tx.booking.update({
            where: { id: payment.bookingId },
            data: { status: client_1.BookingStatus.CANCELLED },
        });
        return { updatedPayment, updatedBooking };
    }));
    return {
        success: false,
        message: "Payment cencel successfully",
        data: result,
    };
});
exports.paymentServices = {
    paymentinit,
    success,
    fail,
    cencel,
};
