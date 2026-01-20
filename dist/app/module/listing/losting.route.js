"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listingRouter = void 0;
const express_1 = require("express");
const listing_controllers_1 = require("./listing.controllers");
const cheakAuth_1 = __importDefault(require("../../sheard/cheakAuth"));
const client_1 = require("@prisma/client");
const multer_config_1 = require("../../config/multer.config");
const validation_1 = __importDefault(require("../../sheard/validation"));
const listing_validation_1 = require("./listing.validation");
const router = (0, express_1.Router)();
router.post("/create", multer_config_1.multerUpload.array("files"), (0, validation_1.default)(listing_validation_1.createListingSchema), (0, cheakAuth_1.default)(client_1.Role.GUIDE), listing_controllers_1.listingContorller.createListing);
router.get("/getALlListing", 
// cheakAuth(...Object.values(Role)),
listing_controllers_1.listingContorller.getAllListing);
router.get("/popular", listing_controllers_1.listingContorller.popularListing);
router.patch("/:id", (0, validation_1.default)(listing_validation_1.updateListingSchema), (0, cheakAuth_1.default)(client_1.Role.GUIDE), listing_controllers_1.listingContorller.UpdateListing);
router.delete("/:id", (0, cheakAuth_1.default)(client_1.Role.GUIDE), listing_controllers_1.listingContorller.deleteListing);
exports.listingRouter = router;
