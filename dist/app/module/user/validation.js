"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserZodSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = __importDefault(require("zod"));
exports.createUserZodSchema = zod_1.default.object({
    name: zod_1.default.string(),
    email: zod_1.default.string({ error: "email is required" }).email(),
    password: zod_1.default.string({ error: "password is required" }),
    role: zod_1.default.string().optional().default(client_1.Role.TOURIST),
    bio: zod_1.default.string().optional(),
    profilePhoto: zod_1.default.string().optional(),
    language: zod_1.default.array(zod_1.default.string()).optional(),
});
const updateUserZodSchema = zod_1.default.object({
    name: zod_1.default.string().optional(),
    email: zod_1.default.string().email().optional(),
    password: zod_1.default.string().optional(),
    role: zod_1.default.string().optional().optional,
    bio: zod_1.default.string().optional(),
    profilePhoto: zod_1.default.string().optional(),
    language: zod_1.default.array(zod_1.default.string()).optional(),
});
