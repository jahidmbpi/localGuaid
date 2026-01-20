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
exports.authServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const prisma_1 = require("../../config/prisma");
const appError_1 = __importDefault(require("../../helper/appError"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const createTocken_1 = __importDefault(require("../../sheard/createTocken"));
const client_1 = require("@prisma/client");
const setCoockie_1 = require("../../sheard/setCoockie");
const logInWithEmailAndPassword = (res, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExsitUser = yield prisma_1.prisma.user.findUnique({
        where: {
            email: payload.email,
        },
    });
    if (!isExsitUser) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "user  not found");
    }
    if (!isExsitUser.password) {
        throw new appError_1.default(404, "password missing");
    }
    if (isExsitUser.isDeleted) {
        throw new appError_1.default(404, "password missing");
    }
    const matchPassword = yield bcryptjs_1.default.compare(payload.password, isExsitUser === null || isExsitUser === void 0 ? void 0 : isExsitUser.password);
    if (matchPassword === false) {
        throw new appError_1.default(404, "invalid password, plase provide valid password");
    }
    if (isExsitUser.status === client_1.UserStatus.BLOCK) {
        throw new appError_1.default(403, "Your account is blocked");
    }
    if (isExsitUser.status === client_1.UserStatus.INACTIVE) {
        throw new appError_1.default(403, "Your account is inactive");
    }
    const tockenInfo = (0, createTocken_1.default)(isExsitUser);
    (0, setCoockie_1.setCoockie)(res, tockenInfo);
    return {
        accessTocken: tockenInfo.accessTocken,
        refreshTocken: tockenInfo.refreshTocken,
    };
});
const Me = (user) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(user === null || user === void 0 ? void 0 : user.userId)) {
        throw new Error("Unauthorized user");
    }
    const loggedInUser = yield prisma_1.prisma.user.findUnique({
        where: {
            id: user.userId,
            isDeleted: false,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            bio: true,
            phone: true,
            parmanentAddress: true,
            presentAddress: true,
            profilePhoto: true,
            status: true,
            language: true,
            credentials: true,
            guideInfo: user.role === client_1.Role.GUIDE,
            touristInfo: user.role === client_1.Role.TOURIST,
            createdAt: true,
        },
    });
    if (!loggedInUser) {
        throw new appError_1.default(404, "User not found");
    }
    return loggedInUser;
});
exports.authServices = {
    logInWithEmailAndPassword,
    Me,
};
