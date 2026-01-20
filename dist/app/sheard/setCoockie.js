"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCoockie = void 0;
const setCoockie = (res, tockenInfo) => {
    res.cookie("accessTocken", tockenInfo.accessTocken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
    });
    res.cookie("refreshTocken", tockenInfo.refreshTocken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
    });
};
exports.setCoockie = setCoockie;
