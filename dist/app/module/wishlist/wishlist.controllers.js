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
exports.wishlistController = void 0;
const catchAsync_1 = __importDefault(require("../../sheard/catchAsync"));
const sendResponse_1 = __importDefault(require("../../sheard/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const wishlist_services_1 = require("./wishlist.services");
const addToWishlist = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const { listingId } = req.body;
    const result = yield wishlist_services_1.wishlistServices.addToWishlist(userId, listingId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        success: true,
        message: "Listing added to wishlist successfully",
        data: result,
    });
}));
const removeFromWishlist = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const { listingId } = req.params;
    const result = yield wishlist_services_1.wishlistServices.removeFromWishlist(userId, listingId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Listing removed from wishlist successfully",
        data: result,
    });
}));
const getMyWishlist = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const result = yield wishlist_services_1.wishlistServices.getMyWishlist(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "My wishlist retrieved successfully",
        data: result,
    });
}));
exports.wishlistController = {
    addToWishlist,
    removeFromWishlist,
    getMyWishlist,
};
