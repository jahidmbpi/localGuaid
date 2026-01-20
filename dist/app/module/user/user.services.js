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
exports.userServices = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../../config/prisma");
const client_1 = require("@prisma/client");
const appError_1 = __importDefault(require("../../helper/appError"));
const http_status_codes_1 = require("http-status-codes");
const createUser = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const image = req.file;
    if (image) {
        data.profilePhoto = image.path;
    }
    const IsexsitUser = yield prisma_1.prisma.user.findUnique({
        where: {
            email: data.email,
        },
    });
    if (IsexsitUser) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "this user already exist, please login with email and password");
    }
    const plainPassword = data.password;
    const hashedPassword = yield bcryptjs_1.default.hash(plainPassword, 10);
    console.log(hashedPassword);
    const userData = Object.assign(Object.assign({}, data), { password: hashedPassword });
    const result = yield prisma_1.prisma.user.create({
        data: userData,
    });
    const { password } = result, withOutPassword = __rest(result, ["password"]);
    return withOutPassword;
});
const getAllUser = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.user.findMany({
        include: {
            guideInfo: client_1.Role.GUIDE ? true : false,
            touristBookings: client_1.Role.TOURIST ? true : false,
        },
    });
    return result;
});
const updateUserById = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const user = req.user;
    const payload = req.body;
    const file = req.file;
    console.log("this is user from req", user);
    if (file) {
        payload.profilePhoto = file.path;
    }
    const isexsitUser = yield prisma_1.prisma.user.findUnique({
        where: {
            id,
        },
    });
    if (!isexsitUser) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "user not found");
    }
    if (isexsitUser.isDeleted) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "this user already deleted,please constact authority");
    }
    if (isexsitUser.status === "BLOCK" || isexsitUser.status === "INACTIVE") {
        throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "This user is blocked or inactive. Please contact authority.");
    }
    if (isexsitUser.role === user.role) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "you are not authorized");
    }
    const result = yield prisma_1.prisma.user.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.prisma.user.findUnique({
        where: { id },
        include: {
            guideInfo: true,
            touristBookings: true,
        },
    });
    if (!user) {
        throw new appError_1.default(404, "User not found");
    }
    if (user.isDeleted) {
        throw new appError_1.default(404, "This user is deleted, please contact authority");
    }
    if (user.status === "BLOCK" || user.status === "INACTIVE") {
        throw new appError_1.default(403, "This user is blocked or inactive, please contact authority");
    }
    const { password } = user, withoutPassword = __rest(user, ["password"]);
    return withoutPassword;
});
exports.userServices = {
    createUser,
    getAllUser,
    updateUserById,
    getUserById,
};
