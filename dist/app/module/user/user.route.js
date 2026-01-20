"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const client_1 = require("@prisma/client");
const cheakAuth_1 = __importDefault(require("../../sheard/cheakAuth"));
const user_controllers_1 = require("./user.controllers");
const express_1 = require("express");
const multer_config_1 = require("../../config/multer.config");
const validation_1 = __importDefault(require("../../sheard/validation"));
const validation_2 = require("./validation");
const router = (0, express_1.Router)();
router.post("/create", multer_config_1.multerUpload.single("file"), (0, validation_1.default)(validation_2.createUserZodSchema), user_controllers_1.userController.createUser);
router.get("/getalluser", (0, cheakAuth_1.default)(client_1.Role.ADMIN), user_controllers_1.userController.getAllUser);
router.get("/:id", (0, cheakAuth_1.default)(...Object.values(client_1.Role)), user_controllers_1.userController.getUserById);
router.patch("/:id", multer_config_1.multerUpload.single("file"), (0, cheakAuth_1.default)(...Object.values(client_1.Role)), user_controllers_1.userController.updateUserById);
exports.userRouter = router;
