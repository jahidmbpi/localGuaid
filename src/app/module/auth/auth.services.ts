import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/prisma";
import AppError from "../../helper/appError";
import bcrypt from "bcryptjs";
import { Response } from "express";
import createUserTocken from "../../sheard/createTocken";
import { UserStatus } from "@prisma/client";
import { setCoockie } from "../../sheard/setCoockie";
const logInWithEmailAndPassword = async (
  res: Response,
  payload: {
    email: string;
    password: string;
  }
) => {
  const isExsitUser = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });
  if (!isExsitUser) {
    throw new AppError(StatusCodes.NOT_FOUND, "user  not found");
  }
  if (!isExsitUser.password) {
    throw new AppError(404, "password missing");
  }
  if (isExsitUser.isDeleted) {
    throw new AppError(404, "password missing");
  }
  const matchPassword = await bcrypt.compare(
    payload.password,
    isExsitUser?.password
  );
  if (matchPassword === false) {
    throw new AppError(404, "invalid password, plase provide valid password");
  }
  if (isExsitUser.status === UserStatus.BLOCK) {
    throw new AppError(403, "Your account is blocked");
  }

  if (isExsitUser.status === UserStatus.INACTIVE) {
    throw new AppError(403, "Your account is inactive");
  }

  const tockenInfo = createUserTocken(isExsitUser);
  setCoockie(res, tockenInfo);
  return {
    accessTocken: tockenInfo.accessTocken,
    refreshTocken: tockenInfo.refreshTocken,
  };
};

export const authServices = {
  logInWithEmailAndPassword,
};
