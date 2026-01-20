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
exports.authController = void 0;
const catchAsync_1 = __importDefault(require("../../sheard/catchAsync"));
const sendResponse_1 = __importDefault(require("../../sheard/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const auth_services_1 = require("./auth.services");
const logInWithEmailAndPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const result = yield auth_services_1.authServices.logInWithEmailAndPassword(res, payload);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "login",
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        data: result,
    });
}));
const Me = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield auth_services_1.authServices.Me(user);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "logedIn user retrived succesfully",
        statusCode: http_status_codes_1.StatusCodes.OK,
        data: result,
    });
}));
exports.authController = {
    logInWithEmailAndPassword,
    Me,
};
