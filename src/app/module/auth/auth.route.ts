import { Router } from "express";
import { authController } from "./auth.controllers";
import cheakAuth from "../../sheard/cheakAuth";
import { Role } from "@prisma/client";

const router = Router();
router.post("/login", authController.logInWithEmailAndPassword);
router.get("/me", cheakAuth(...Object.values(Role)), authController.Me);

export const authRouter = router;
