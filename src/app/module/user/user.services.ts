import { Request } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../../config/prisma";
import { Role } from "@prisma/client";
const createUser = async (req: Request) => {
  const data = req.body;

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
    },
  });
  return result;
};
export const userServices = {
  createUser,
  getAllUser,
};
