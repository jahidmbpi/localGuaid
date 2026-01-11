import { email } from "zod";
import { Request } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../../config/prisma";
import { Role } from "@prisma/client";
import AppError from "../../helper/appError";
import { StatusCodes } from "http-status-codes";
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
export const userServices = {
  createUser,
  getAllUser,
};
