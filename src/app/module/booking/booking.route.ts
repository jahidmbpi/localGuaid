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
router.get(
  "/turistBooking",
  cheakAuth(Role.TOURIST),
  bookingController.turistBooking
);

router.patch("/id", cheakAuth(Role.GUIDE), bookingController.confrimBooking);

export const bookingRouter = router;
