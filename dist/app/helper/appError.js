"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    constructor(StatusCode, massage, stak = "") {
        super(massage);
        this.StatusCode = StatusCode;
        if (stak) {
            this.stack = stak;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.default = AppError;
