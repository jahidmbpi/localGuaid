import { Router } from "express";
import { bookingController } from "./booking.controllers";
import cheakAuth from "../../sheard/cheakAuth";
import { Role } from "@prisma/client";

const router = Router();
router.post(
  "/create-booking/:id",
  cheakAuth(Role.TOURIST, Role.GUIDE),
  bookingController.createBooking
);

router.get(
  "/getallbooking",
  cheakAuth(Role.GUIDE, Role.ADMIN),
  bookingController.getALlbooking
);
router.get("/mybooking", cheakAuth(Role.GUIDE), bookingController.myBooking);

export const bookingRouter = router;
