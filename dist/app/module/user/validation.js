"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserZodSchema = exports.createUserZodSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
exports.createUserZodSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    email: zod_1.z.string().email("Invalid email"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
    role: zod_1.z.nativeEnum(client_1.Role).optional().default(client_1.Role.TOURIST),
    bio: zod_1.z.string().optional(),
    language: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.updateUserZodSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional().or(zod_1.z.literal("")),
    password: zod_1.z.string().optional(),
    role: zod_1.z.nativeEnum(client_1.Role).optional(),
    bio: zod_1.z.string().optional(),
    language: zod_1.z.array(zod_1.z.string()).optional(),
    presentAddress: zod_1.z.string().optional(),
    parmanentAddress: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional(),
});
