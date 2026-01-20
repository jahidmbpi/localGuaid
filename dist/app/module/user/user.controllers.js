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
exports.userController = void 0;
const sendResponse_1 = __importDefault(require("../../sheard/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const user_services_1 = require("./user.services");
const catchAsync_1 = __importDefault(require("../../sheard/catchAsync"));
const createUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_services_1.userServices.createUser(req);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "user created successfuly",
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        data: result,
    });
}));
const getAllUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_services_1.userServices.getAllUser();
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "all user retrived success",
        statusCode: http_status_codes_1.StatusCodes.OK,
        data: result,
    });
}));
const updateUserById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_services_1.userServices.updateUserById(req);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "user updated succesfully",
        statusCode: http_status_codes_1.StatusCodes.OK,
        data: result,
    });
}));
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield user_services_1.userServices.getUserById(id);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            statusCode: http_status_codes_1.StatusCodes.OK,
            message: "User fetched successfully",
            data: user,
        });
    }
    catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            statusCode: error.statusCode || 500,
            message: error.message || "Something went wrong",
        });
    }
});
exports.userController = {
    createUser,
    getAllUser,
    updateUserById,
    getUserById,
};
