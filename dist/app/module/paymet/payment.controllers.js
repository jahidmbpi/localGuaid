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
exports.pamentConroller = void 0;
const catchAsync_1 = __importDefault(require("../../sheard/catchAsync"));
const http_status_codes_1 = require("http-status-codes");
const sendResponse_1 = __importDefault(require("../../sheard/sendResponse"));
const payment_services_1 = require("./payment.services");
const env_1 = require("../../config/env");
const paymentInit = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingId = req.params.id;
    const result = yield payment_services_1.paymentServices.paymentinit(bookingId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        message: " all listing retrived success",
        data: result,
    });
}));
const successpayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transectionId = String(req.query.transactionId);
    const valId = req.body.val_id;
    console.log(valId, "this is validate id from ssl");
    yield payment_services_1.paymentServices.success(transectionId, valId);
    res.redirect(`${env_1.envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${transectionId}`);
}));
const fail = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transectionId = String(req.query.transactionId);
    yield payment_services_1.paymentServices.fail(transectionId);
    res.redirect(`${env_1.envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${transectionId}`);
}));
const cencel = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transectionId = String(req.query.transactionId);
    yield payment_services_1.paymentServices.cencel(transectionId);
    res.redirect(`${env_1.envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${transectionId}`);
}));
exports.pamentConroller = {
    paymentInit,
    successpayment,
    fail,
    cencel,
};
