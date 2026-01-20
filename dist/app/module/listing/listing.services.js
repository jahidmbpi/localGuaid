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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listingServices = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../config/prisma");
const appError_1 = __importDefault(require("../../helper/appError"));
const http_status_codes_1 = require("http-status-codes");
const calculatePagination_1 = __importDefault(require("../../sheard/calculatePagination"));
const listing_constant_1 = require("./listing.constant");
const createListing = (user, payload, files) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(user === null || user === void 0 ? void 0 : user.userId)) {
        throw new appError_1.default(401, "Unauthorized");
    }
    if (user.role !== "GUIDE") {
        throw new appError_1.default(403, "Only guides can create a listing");
    }
    const images = files.map((file) => file.path) || [];
    const result = yield prisma_1.prisma.listing.create({
        data: Object.assign(Object.assign({}, payload), { guideId: user.userId, images }),
    });
    return result;
});
const getAllLising = (filter, option) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = (0, calculatePagination_1.default)(option);
    console.log(page, limit, skip);
    const { searchTarm } = filter, filterData = __rest(filter, ["searchTarm"]);
    console.log(searchTarm);
    const andConditon = [];
    if (searchTarm) {
        andConditon.push({
            OR: listing_constant_1.searchAbleField.map((field) => ({
                [field]: {
                    contains: searchTarm,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (Object.keys(filterData).length > 0) {
        const filterCondition = Object.keys(filterData).map((key) => ({
            [key]: {
                equals: filterData[key],
            },
        }));
        andConditon.push(...filterCondition);
    }
    const whereCondition = andConditon.length > 0 ? { AND: andConditon } : {};
    const result = yield prisma_1.prisma.listing.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });
    const total = yield prisma_1.prisma.listing.count({
        where: whereCondition,
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const UpdateListing = (paylod, listingId, user) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistListing = yield prisma_1.prisma.listing.findFirst({
        where: {
            id: listingId,
        },
        include: {
            guide: true,
        },
    });
    console.log(isExistListing);
    console.log(paylod);
    console.log(listingId);
    if (!isExistListing) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "listing not found");
    }
    if (user.role !== client_1.Role.GUIDE) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Only guides can create a listing");
    }
    const isExistGuid = yield prisma_1.prisma.user.findFirst({
        where: {
            id: isExistListing.guideId,
        },
    });
    if (!isExistGuid) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "guaid not found");
    }
    if (isExistGuid.role !== user.role) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "you are not authorized for this route");
    }
    const result = yield prisma_1.prisma.listing.update({
        where: {
            id: listingId,
        },
        data: paylod,
    });
    return result;
});
const deleteListing = (lisTingId, user) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistListing = yield prisma_1.prisma.listing.findFirst({
        where: {
            id: lisTingId,
        },
    });
    if (!isExistListing) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "listing not found ");
    }
    if (isExistListing.isActive) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "this listing already block");
    }
    if (isExistListing.guideId !== user.UserId) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "you are not permited for this route");
    }
    const deleteListing = yield prisma_1.prisma.listing.delete({
        where: {
            id: lisTingId,
        },
    });
    return deleteListing;
});
const popolarListing = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.listing.findMany({
        where: {
            bookingCount: {
                gte: 3,
            },
        },
        take: 4,
        orderBy: {
            bookingCount: "desc",
        },
    });
    return result;
});
exports.listingServices = {
    createListing,
    UpdateListing,
    deleteListing,
    getAllLising,
    popolarListing,
};
