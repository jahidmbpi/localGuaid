"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deshbordRouter = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const cheakAuth_1 = __importDefault(require("../../sheard/cheakAuth"));
const deshbord_controllers_1 = require("./deshbord.controllers");
const router = (0, express_1.Router)();
router.get("/meta-data", (0, cheakAuth_1.default)(client_1.Role.ADMIN, client_1.Role.GUIDE, client_1.Role.TOURIST), deshbord_controllers_1.deshbordController.getDashboardMetaData);
exports.deshbordRouter = router;
