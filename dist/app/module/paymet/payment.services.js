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
const sslcommarze_services_1 = require("../../sslcommarz/sslcommarze.services");
const paymentinit = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(bookingId);
    const isExsistBokking = yield prisma_1.prisma.booking.findUnique({
        where: {
            id: bookingId,
        },
    });
    console.log(isExsistBokking);
    const turist = yield prisma_1.prisma.user.findUnique({
        where: {
            id: isExsistBokking === null || isExsistBokking === void 0 ? void 0 : isExsistBokking.touristId,
        },
    });
    console.log("this is turist", turist);
    if (!isExsistBokking) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Booking not found");
    }
    if (!turist) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Tourist not found");
    }
    const isExsitpayment = yield prisma_1.prisma.payment.findUnique({
        where: {
            bookingId,
        },
    });
    if (!isExsitpayment) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Tourist not found");
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
const success = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("this is success");
});
const fail = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("this is fail");
});
const cencel = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("this is cencel");
});
exports.paymentServices = {
    paymentinit,
    success,
    fail,
    cencel,
};
