import { Router } from "express";
import { listingContorller } from "./listing.controllers";
import cheakAuth from "../../sheard/cheakAuth";
import { Role } from "@prisma/client";

import { multerUpload } from "../../config/multer.config";
import validateRequest from "../../sheard/validation";
import { createListingSchema, updateListingSchema } from "./listing.validation";

const router = Router();
router.post(
  "/create",
  multerUpload.array("files"),
  validateRequest(createListingSchema),
  cheakAuth(Role.GUIDE),
  listingContorller.createListing
);
router.patch(
  "/:id",
  validateRequest(updateListingSchema),
  cheakAuth(Role.GUIDE),
  listingContorller.UpdateListing
);
router.delete("/:id", cheakAuth(Role.GUIDE), listingContorller.deleteListing);
export const listingRouter = router;
