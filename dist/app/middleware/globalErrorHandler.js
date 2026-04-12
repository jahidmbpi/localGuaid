"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorhandelar = void 0;
const handelduplicateerror_1 = require("../helper/handelduplicateerror");
const zod_1 = require("zod");
const handelZodError_1 = require("../helper/handelZodError");
const env_1 = require("../config/env");
const globalErrorhandelar = (err, req, res, next) => {
    let ststusCode = 500;
    let message = "something went wrong";
    let errorSources = [];
    if (err.code === 11000) {
        const simplified = (0, handelduplicateerror_1.handleDuplicateError)(err);
        ststusCode = simplified.statusCode;
        message = simplified.message;
    }
    else if (err instanceof zod_1.ZodError) {
        const simplified = (0, handelZodError_1.handleZodError)(err);
        ststusCode = simplified.statusCode;
        message = simplified.message;
        errorSources = simplified.errorSources || [];
    }
    res.status(ststusCode).json({
        success: false,
        message,
        errorSources,
        err: env_1.envVars.NODE_ENV === "development" ? err : undefined,
        stack: env_1.envVars.NODE_ENV === "development" ? err.stack : undefined,
    });
};
exports.globalErrorhandelar = globalErrorhandelar;
