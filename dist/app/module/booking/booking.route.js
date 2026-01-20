"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingRouter = void 0;
const express_1 = require("express");
const booking_controllers_1 = require("./booking.controllers");
const cheakAuth_1 = __importDefault(require("../../sheard/cheakAuth"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.post("/create-booking/:id", (0, cheakAuth_1.default)(client_1.Role.TOURIST, client_1.Role.GUIDE), booking_controllers_1.bookingController.createBooking);
router.get("/getallbooking", (0, cheakAuth_1.default)(client_1.Role.GUIDE, client_1.Role.ADMIN), booking_controllers_1.bookingController.getALlbooking);
router.get("/mybooking", (0, cheakAuth_1.default)(client_1.Role.GUIDE), booking_controllers_1.bookingController.myBooking);
router.get("/turistBooking", (0, cheakAuth_1.default)(client_1.Role.TOURIST), booking_controllers_1.bookingController.turistBooking);
router.patch("/id", (0, cheakAuth_1.default)(client_1.Role.GUIDE), booking_controllers_1.bookingController.confrimBooking);
exports.bookingRouter = router;
