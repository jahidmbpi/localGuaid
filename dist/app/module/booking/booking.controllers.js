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
exports.bookingController = void 0;
const catchAsync_1 = __importDefault(require("../../sheard/catchAsync"));
const sendResponse_1 = __importDefault(require("../../sheard/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const booking_services_1 = require("./booking.services");
const pick_1 = __importDefault(require("../../sheard/pick"));
const createBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const user = req.user;
    const listingId = req.params.id;
    const result = yield booking_services_1.bookingServices.createBooking(payload, user, listingId);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "booking create succsess",
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        data: result,
    });
}));
const getALlbooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const option = (0, pick_1.default)(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const result = yield booking_services_1.bookingServices.getAllBooking(option);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "all booking retrived succsess",
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        data: result,
    });
}));
const myBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.user.userId;
    const option = (0, pick_1.default)(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const result = yield booking_services_1.bookingServices.myBooking(id, option);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "my booking retrived success",
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        data: result,
    });
}));
const confrimBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingId = req.params.id;
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "booking confrimed success",
        data: "",
    });
}));
const turistBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.user.userId;
    const option = (0, pick_1.default)(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const result = yield booking_services_1.bookingServices.turistBooking(id, option);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "turist booking retrived success",
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        data: result,
    });
}));
exports.bookingController = {
    createBooking,
    getALlbooking,
    myBooking,
    confrimBooking,
    turistBooking,
};
