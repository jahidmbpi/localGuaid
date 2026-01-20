"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const genareteTocken_1 = __importDefault(require("../helper/genareteTocken"));
const env_1 = require("../config/env");
const createUserTocken = (user) => {
    const JwtPayload = {
        userId: user.id,
        role: user.role,
        email: user.email,
    };
    const accessTocken = (0, genareteTocken_1.default)(JwtPayload, env_1.envVars.JWT_ACCESS_SECRET, env_1.envVars.JWT_ACCESS_EXPIRE);
    const refreshTocken = (0, genareteTocken_1.default)(JwtPayload, env_1.envVars.JWT_ACCESS_SECRET, env_1.envVars.JWT_ACCESS_EXPIRE);
    return {
        accessTocken,
        refreshTocken,
    };
};
exports.default = createUserTocken;
