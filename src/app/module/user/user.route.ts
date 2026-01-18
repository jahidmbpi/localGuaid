import { Role } from "@prisma/client";
import cheakAuth from "../../sheard/cheakAuth";
import { userController } from "./user.controllers";
import { Router } from "express";
import { multerUpload } from "../../config/multer.config";
import validateRequest from "../../sheard/validation";
import { createUserZodSchema } from "./validation";

const router = Router();

router.post(
  "/create",
  multerUpload.single("file"),
  validateRequest(createUserZodSchema),
  userController.createUser
);
router.get("/getalluser", cheakAuth(Role.ADMIN), userController.getAllUser);
router.get(
  "/:id",
  cheakAuth(...Object.values(Role)),
  userController.getUserById
);
router.patch(
  "/:id",
  multerUpload.single("file"),
  cheakAuth(...Object.values(Role)),
  userController.updateUserById
);

export const userRouter = router;
