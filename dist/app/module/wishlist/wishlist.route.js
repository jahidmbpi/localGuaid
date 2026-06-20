"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wishlistRouter = void 0;
const express_1 = require("express");
const wishlist_controllers_1 = require("./wishlist.controllers");
const cheakAuth_1 = __importDefault(require("../../sheard/cheakAuth"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.post("/", (0, cheakAuth_1.default)(client_1.Role.TOURIST), wishlist_controllers_1.wishlistController.addToWishlist);
router.delete("/:listingId", (0, cheakAuth_1.default)(client_1.Role.TOURIST), wishlist_controllers_1.wishlistController.removeFromWishlist);
router.get("/my-wishlist", (0, cheakAuth_1.default)(client_1.Role.TOURIST), wishlist_controllers_1.wishlistController.getMyWishlist);
exports.wishlistRouter = router;
