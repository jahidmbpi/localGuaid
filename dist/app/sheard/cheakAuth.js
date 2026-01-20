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
const client_1 = require("@prisma/client");
const appError_1 = __importDefault(require("../helper/appError"));
const http_status_codes_1 = require("http-status-codes");
const env_1 = require("../config/env");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../config/prisma");
const cheakAuth = (...alloewedRole) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const accessTocken = req.headers.authorization || req.cookies.accessTocken;
            if (!accessTocken) {
                throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "no tocken recived");
            }
            if (!env_1.envVars.JWT_ACCESS_SECRET) {
                throw new appError_1.default(500, "JWT secret is not configured");
            }
            const verifyTocken = jsonwebtoken_1.default.verify(accessTocken, env_1.envVars.JWT_ACCESS_SECRET);
            const isExsitUser = yield prisma_1.prisma.user.findUnique({
                where: {
                    email: verifyTocken.email,
                },
            });
            if (!isExsitUser) {
                throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "user dose not exsist");
            }
            if (isExsitUser.isDeleted) {
                throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "user is deleted");
            }
            if (isExsitUser.status === client_1.UserStatus.BLOCK ||
                isExsitUser.status === client_1.UserStatus.INACTIVE) {
                throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, " you are not authorized. please contact higher authority");
            }
            const userRole = verifyTocken.role;
            if (!alloewedRole.includes(userRole)) {
                throw new appError_1.default(403, "You are not permitted for this route");
            }
            req.user = verifyTocken;
            next();
        }
        catch (error) {
            next(error);
        }
    });
};
exports.default = cheakAuth;
