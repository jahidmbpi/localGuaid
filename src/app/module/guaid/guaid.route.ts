import { Router } from "express";
import { guaidController } from "./guaid.controllers";
import cheakAuth from "../../sheard/cheakAuth";
import { Role } from "@prisma/client";

const router = Router();
router.post(
  "/become-guaid",
  cheakAuth(Role.TOURIST),
  guaidController.becomeGuaid
);
router.get("/popular-guaid", guaidController.getAllPopularGuaid);

export const guaidRouter = router;
