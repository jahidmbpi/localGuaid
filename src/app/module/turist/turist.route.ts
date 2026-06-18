import { Router } from "express";
import { turistController } from "./turist.controllers";
import cheakAuth from "../../sheard/cheakAuth";
import { Role } from "@prisma/client";

const router = Router();
router.get("/mybooking", cheakAuth(Role.TOURIST), turistController.myBooking);
router.get(
  "/upcoming-past",
  cheakAuth(Role.TOURIST),
  turistController.upcomingAndPastBokkingforTurist,
);

export const turistRouter = router;
