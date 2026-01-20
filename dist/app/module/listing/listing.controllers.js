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
exports.listingContorller = void 0;
const catchAsync_1 = __importDefault(require("../../sheard/catchAsync"));
const sendResponse_1 = __importDefault(require("../../sheard/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const listing_services_1 = require("./listing.services");
const pick_1 = __importDefault(require("../../sheard/pick"));
const listing_constant_1 = require("./listing.constant");
const createListing = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const payload = req.body;
    const files = req.files;
    const result = yield listing_services_1.listingServices.createListing(user, payload, files);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        message: "listing create success",
        data: result,
    });
}));
const getAllListing = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = (0, pick_1.default)(req.query, listing_constant_1.filterableField);
    const option = (0, pick_1.default)(req.query, [
        "page",
        "limit",
        "skip",
        "sortBy",
        "sortOrder",
    ]);
    console.log(req.query);
    const result = yield listing_services_1.listingServices.getAllLising(filter, option);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        message: " all listing retrived success",
        data: result,
    });
}));
const UpdateListing = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const listingId = req.params.id;
    const user = req.user;
    const result = yield listing_services_1.listingServices.UpdateListing(payload, listingId, user);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        message: "listing update success",
        data: result,
    });
}));
const deleteListing = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const listingId = req.params.id;
    const user = req.user;
    const result = yield listing_services_1.listingServices.deleteListing(listingId, user);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        message: "listing delete success",
        data: result,
    });
}));
const popularListing = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield listing_services_1.listingServices.popolarListing();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: " popular listing retrived success",
        data: result,
    });
}));
exports.listingContorller = {
    createListing,
    UpdateListing,
    deleteListing,
    getAllListing,
    popularListing,
};
