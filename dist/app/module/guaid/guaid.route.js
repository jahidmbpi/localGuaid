"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.guaidRouter = void 0;
const express_1 = require("express");
const guaid_controllers_1 = require("./guaid.controllers");
const cheakAuth_1 = __importDefault(require("../../sheard/cheakAuth"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.post("/become-guaid", (0, cheakAuth_1.default)(client_1.Role.TOURIST), guaid_controllers_1.guaidController.becomeGuaid);
router.get("/popular-guaid", guaid_controllers_1.guaidController.getAllPopularGuaid);
exports.guaidRouter = router;
