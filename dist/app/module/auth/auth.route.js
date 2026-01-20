"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_controllers_1 = require("./auth.controllers");
const cheakAuth_1 = __importDefault(require("../../sheard/cheakAuth"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.post("/login", auth_controllers_1.authController.logInWithEmailAndPassword);
router.get("/me", (0, cheakAuth_1.default)(...Object.values(client_1.Role)), auth_controllers_1.authController.Me);
exports.authRouter = router;
