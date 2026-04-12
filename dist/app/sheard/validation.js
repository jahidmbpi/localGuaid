"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const validateRequest = (zodSchema) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let body = ((_a = req.body) === null || _a === void 0 ? void 0 : _a.data) || req.body;
        if (!req.body) {
            throw new Error("Request body is missing");
        }
        console.log(body);
        if (typeof body === "string") {
            body = JSON.parse(body);
        }
        req.body = yield zodSchema.parseAsync(body);
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.default = validateRequest;
