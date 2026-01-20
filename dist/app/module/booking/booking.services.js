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
exports.bookingServices = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../config/prisma");
const appError_1 = __importDefault(require("../../helper/appError"));
const http_status_codes_1 = require("http-status-codes");
const calculatePagination_1 = __importDefault(require("../../sheard/calculatePagination"));
const uuid_1 = require("uuid");
const createBooking = (payload, user, listingId) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistGuide = yield prisma_1.prisma.user.findUnique({
        where: { id: payload.guideId },
    });
    if (!isExistGuide) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Guide not found");
    }
    if (isExistGuide.status === client_1.UserStatus.BLOCK ||
        isExistGuide.status === client_1.UserStatus.INACTIVE) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "This guide is not available");
    }
    const isExistListing = yield prisma_1.prisma.listing.findFirst({
        where: { id: listingId, isActive: true },
    });
    if (!isExistListing) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Listing not available");
    }
    const tourist = yield prisma_1.prisma.user.findUnique({
        where: {
            id: user.userId,
        },
    });
    if (!tourist) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Tourist not found");
    }
    if (!tourist.phone) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, " phone number is missing! please update your profile");
    }
    if (!tourist.presentAddress || !tourist.parmanentAddress) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, " address is missing! please update your profile");
    }
    const totalAmount = isExistListing.price * payload.groupSize;
    const transactionId = (0, uuid_1.v4)();
    const result = yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // ✅ 1️⃣ Create Booking
        const booking = yield tx.booking.create({
            data: {
                startDate: payload.startDate,
                endDate: payload.endDate,
                listingId,
                guideId: payload.guideId,
                groupSize: payload.groupSize,
                touristId: user.userId,
                totalAmount,
                paymentStatus: client_1.PaymentStatus.UNPAID,
            },
        });
        // ✅ 2️⃣ Create Payment (UNPAID)
        const payment = yield tx.payment.create({
            data: {
                bookingId: booking.id,
                transactionId,
                amount: booking.totalAmount,
                status: client_1.PaymentStatus.UNPAID,
            },
        });
        // ✅ 3️⃣ Update listing booking count
        yield tx.listing.update({
            where: { id: listingId },
            data: {
                bookingCount: { increment: 1 },
            },
        });
        return {
            booking,
            payment,
        };
    }));
    return result;
});
const getAllBooking = (option) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = (0, calculatePagination_1.default)(option);
    const result = yield prisma_1.prisma.booking.findMany({
        take: limit,
        skip,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });
    const total = yield prisma_1.prisma.booking.count();
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const myBooking = (id, option) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = (0, calculatePagination_1.default)(option);
    const reult = yield prisma_1.prisma.booking.findMany({
        where: {
            guideId: id,
            status: client_1.BookingStatus.PENDING,
        },
        take: limit,
        skip,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });
    const total = yield prisma_1.prisma.booking.count();
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: reult,
    };
});
const confrimBooking = (bookingId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistBooking = yield prisma_1.prisma.booking.findUnique({
        where: { id: bookingId },
    });
    if (!isExistBooking) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Booking not found");
    }
    if (isExistBooking.status === client_1.BookingStatus.CENCELLED &&
        payload.status === "CENCELLED") {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "This booking is already canceled");
    }
    if (isExistBooking.status === client_1.BookingStatus.CONFRIMED &&
        payload.status === "CONFRIMED") {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "This booking is already confirmed");
    }
    const updateBooking = yield prisma_1.prisma.booking.update({
        where: {
            id: bookingId,
        },
        data: {
            status: payload.status,
        },
    });
    return updateBooking;
});
const turistBooking = (id, option) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = (0, calculatePagination_1.default)(option);
    const reult = yield prisma_1.prisma.booking.findMany({
        where: {
            touristId: id,
        },
        take: limit,
        skip,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });
    const total = yield prisma_1.prisma.booking.count();
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: reult,
    };
});
exports.bookingServices = {
    createBooking,
    getAllBooking,
    myBooking,
    confrimBooking,
    turistBooking,
};
