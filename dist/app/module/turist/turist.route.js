"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const turist_controllers_1 = require("./turist.controllers");
const cheakAuth_1 = __importDefault(require("../../sheard/cheakAuth"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.get("/mybooking", (0, cheakAuth_1.default)(client_1.Role.TOURIST), turist_controllers_1.turistController.myBooking);
