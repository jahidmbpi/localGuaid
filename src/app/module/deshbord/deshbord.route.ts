import { Router } from "express";
import { Role } from "@prisma/client";
import cheakAuth from "../../sheard/cheakAuth";
import { deshbordController } from "./deshbord.controllers";

const router = Router();

router.get(
  "/meta-data",
  cheakAuth(Role.ADMIN, Role.GUIDE, Role.TOURIST),
  deshbordController.getDashboardMetaData,
);

export const deshbordRouter = router;
