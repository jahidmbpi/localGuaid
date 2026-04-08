import { Router } from "express";
import { bookingController } from "./booking.controllers";
import cheakAuth from "../../sheard/cheakAuth";
import { Role } from "@prisma/client";
import validateRequest from "../../sheard/validation";
import { createBookingSchema } from "./booking.validation";

const router = Router();
router.post(
  "/create-booking/:id",
  cheakAuth(Role.TOURIST, Role.GUIDE),
  bookingController.createBooking,
);

router.get(
  "/getallbooking",
  cheakAuth(Role.GUIDE, Role.ADMIN),
  bookingController.getALlbooking,
);
router.get("/mybooking", cheakAuth(Role.GUIDE), bookingController.myBooking);
router.get(
  "/turistBooking",
  cheakAuth(Role.TOURIST),
  bookingController.turistBooking,
);

router.patch(
  "/:id",
  cheakAuth(Role.GUIDE),
  validateRequest(createBookingSchema),
  bookingController.confrimBooking,
);

export const bookingRouter = router;
