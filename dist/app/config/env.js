"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envVars = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const loadEnvVariable = () => {
    const requireVariable = [
        "PORT",
        "CLOUDENARY_NAME",
        "CLOUDENARY_API_KEY",
        "CLOUDENARY_API_SECRET",
        "JWT_ACCESS_SECRET",
        "JWT_ACCESS_EXPIRE",
        "FRONTEND_URL",
        "SSL_STORE_ID",
        "SSL_STORE_PASS",
        "SSL_PAYMENT_API",
        "SSL_VALIDATION_API",
        "SSL_SUCCESS_FRONTEND_URL",
        "SSL_FAIL_FRONTEND_URL",
        "SSL_CANCEL_FRONTEND_URL",
        "SSL_SUCCESS_BACKEND_URL",
        "SSL_FAIL_BACKEND_URL",
        "SSL_CANCEL_BACKEND_URL",
    ];
    requireVariable.forEach((key) => {
        if (!process.env[key]) {
            throw new Error(`missing environment variable ${key}`);
        }
    });
    return {
        PORT: process.env.PORT,
        CLOUDENARY_NAME: process.env.CLOUDENARY_NAME,
        CLOUDENARY_API_KEY: process.env.CLOUDENARY_API_KEY,
        CLOUDENARY_API_SECRET: process.env.CLOUDENARY_API_SECRET,
        JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
        JWT_ACCESS_EXPIRE: process.env.JWT_ACCESS_EXPIRE,
        FRONTEND_URL: process.env.FRONTEND_URL,
        SSL: {
            SSL_STORE_ID: process.env.SSL_STORE_ID,
            SSL_STORE_PASS: process.env.SSL_STORE_PASS,
            SSL_PAYMENT_API: process.env.SSL_PAYMENT_API,
            SSL_VALIDATION_API: process.env.SSL_VALIDATION_API,
            SSL_SUCCESS_FRONTEND_URL: process.env.SSL_SUCCESS_FRONTEND_URL,
            SSL_FAIL_FRONTEND_URL: process.env.SSL_FAIL_FRONTEND_URL,
            SSL_CANCEL_FRONTEND_URL: process.env.SSL_CANCEL_FRONTEND_URL,
            SSL_SUCCESS_BACKEND_URL: process.env.SSL_SUCCESS_BACKEND_URL,
            SSL_FAIL_BACKEND_URL: process.env.SSL_FAIL_BACKEND_URL,
            SSL_CANCEL_BACKEND_URL: process.env.SSL_CANCEL_BACKEND_URL,
        },
    };
};
exports.envVars = loadEnvVariable();
