import { Router } from "express";
import { wishlistController } from "./wishlist.controllers";
import cheakAuth from "../../sheard/cheakAuth";
import { Role } from "@prisma/client";

const router = Router();

router.post(
  "/",
  cheakAuth(Role.TOURIST),
  wishlistController.addToWishlist
);

router.delete(
  "/:listingId",
  cheakAuth(Role.TOURIST),
  wishlistController.removeFromWishlist
);

router.get(
  "/my-wishlist",
  cheakAuth(Role.TOURIST),
  wishlistController.getMyWishlist
);

export const wishlistRouter = router;
