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
exports.guaidServices = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../config/prisma");
const appError_1 = __importDefault(require("../../helper/appError"));
const http_status_codes_1 = require("http-status-codes");
const becomeGuaid = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistUser = yield prisma_1.prisma.user.findFirst({
        where: {
            email: user.email,
        },
    });
    if (!isExistUser) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "user not found");
    }
    if (isExistUser.role === client_1.Role.GUIDE) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "you have already guaid profile");
    }
    if (isExistUser.isDeleted) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "this user already deleted");
    }
    const result = yield prisma_1.prisma.$transaction((tnx) => __awaiter(void 0, void 0, void 0, function* () {
        const updateUserRole = yield prisma_1.prisma.user.update({
            where: {
                id: isExistUser.id,
            },
            data: {
                role: client_1.Role.GUIDE,
            },
        });
        const guaid = yield prisma_1.prisma.guideInfo.create({
            data: Object.assign(Object.assign({}, payload), { userId: user.userId }),
        });
        return guaid;
    }));
    return result;
});
const getAllPopularGuaid = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.user.findMany({
        where: {
            role: "GUIDE",
            isDeleted: false,
            status: "ACTIVE",
        },
        select: {
            profilePhoto: true,
            name: true,
            email: true,
            bio: true,
        },
    });
    if (!result) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "not popular guaid found");
    }
    return result;
});
exports.guaidServices = {
    becomeGuaid,
    getAllPopularGuaid,
};
