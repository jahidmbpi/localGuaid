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
exports.wishlistServices = void 0;
const prisma_1 = require("../../config/prisma");
const appError_1 = __importDefault(require("../../helper/appError"));
const http_status_codes_1 = require("http-status-codes");
const addToWishlist = (userId, listingId) => __awaiter(void 0, void 0, void 0, function* () {
    const listingExists = yield prisma_1.prisma.listing.findUnique({
        where: { id: listingId },
    });
    if (!listingExists) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Tour listing not found");
    }
    // Check if already wishlisted
    const alreadyWishlisted = yield prisma_1.prisma.wishlist.findUnique({
        where: {
            userId_listingId: {
                userId,
                listingId,
            },
        },
    });
    if (alreadyWishlisted) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Listing is already in your wishlist");
    }
    const result = yield prisma_1.prisma.wishlist.create({
        data: {
            userId,
            listingId,
        },
        include: {
            listing: true,
        },
    });
    return result;
});
const removeFromWishlist = (userId, listingId) => __awaiter(void 0, void 0, void 0, function* () {
    const wishlistEntry = yield prisma_1.prisma.wishlist.findUnique({
        where: {
            userId_listingId: {
                userId,
                listingId,
            },
        },
    });
    if (!wishlistEntry) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Wishlist entry not found");
    }
    const result = yield prisma_1.prisma.wishlist.delete({
        where: {
            userId_listingId: {
                userId,
                listingId,
            },
        },
    });
    return result;
});
const getMyWishlist = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.wishlist.findMany({
        where: {
            userId,
        },
        include: {
            listing: {
                include: {
                    guide: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return result;
});
exports.wishlistServices = {
    addToWishlist,
    removeFromWishlist,
    getMyWishlist,
};
