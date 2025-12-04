import { email } from "zod";
import { Role, UserStatus } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import AppError from "../helper/appError";
import { StatusCodes } from "http-status-codes";
import { envVars } from "../config/env";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../config/prisma";
const cheakAuth = (...alloewedRole: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessTocken =
        req.headers.authorization || req.cookies.accessTocken;

      if (!accessTocken) {
        throw new AppError(StatusCodes.BAD_REQUEST, "no tocken recived");
      }
      if (!envVars.JWT_ACCESS_SECRET) {
        throw new AppError(500, "JWT secret is not configured");
      }

      const verifyTocken = jwt.verify(
        accessTocken,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;

      const isExsitUser = await prisma.user.findUnique({
        where: {
          email: verifyTocken.email,
        },
      });

      if (!isExsitUser) {
        throw new AppError(StatusCodes.BAD_REQUEST, "user dose not exsist");
      }

      if (isExsitUser.isDeleted) {
        throw new AppError(StatusCodes.BAD_REQUEST, "user is deleted");
      }
      if (
        isExsitUser.status === UserStatus.BLOCK ||
        isExsitUser.status === UserStatus.INACTIVE
      ) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          " you are not authorized. please contact higher authority"
        );
      }

      const userRole = verifyTocken.role;
      if (!alloewedRole.includes(userRole)) {
        throw new AppError(403, "You are not permitted for this route");
      }
      req.user = verifyTocken;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default cheakAuth;
