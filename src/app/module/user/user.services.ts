import { email } from "zod";
import { Request } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../../config/prisma";
import { Role } from "@prisma/client";
import AppError from "../../helper/appError";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { File } from "buffer";
const createUser = async (req: Request) => {
  const data = req.body;
  const image = req.file;
  if (image) {
    data.profilePhoto = image.path;
  }

  const IsexsitUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (IsexsitUser) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "this user already exist, please login with email and password"
    );
  }

  const plainPassword = data.password;
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  console.log(hashedPassword);

  const userData = {
    ...data,
    password: hashedPassword,
  };

  const result = await prisma.user.create({
    data: userData,
  });

  const { password, ...withOutPassword } = result;
  return withOutPassword;
};

const getAllUser = async () => {
  const result = await prisma.user.findMany({
    include: {
      guideInfo: Role.GUIDE ? true : false,
      touristBookings: Role.TOURIST ? true : false,
    },
  });
  return result;
};

const updateUserById = async (req: Request) => {
  const id = req.params.id;
  const user = req.user;
  const payload = req.body;
  const file = req.file;
  console.log("this is user from req", user);

  if (file) {
    payload.profilePhoto = file.path;
  }
  const isexsitUser = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (!isexsitUser) {
    throw new AppError(StatusCodes.NOT_FOUND, "user not found");
  }
  if (isexsitUser.isDeleted) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "this user already deleted,please constact authority"
    );
  }
  if (isexsitUser.status === "BLOCK" || isexsitUser.status === "INACTIVE") {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "This user is blocked or inactive. Please contact authority."
    );
  }

  if (isexsitUser.role! === user.role) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "you are not authorized");
  }
  const result = await prisma.user.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

export const userServices = {
  createUser,
  getAllUser,
  updateUserById,
};
