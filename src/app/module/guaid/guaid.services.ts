import { email } from "zod";
import { GuideInfo, Role } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../config/prisma";
import AppError from "../../helper/appError";
import { StatusCodes } from "http-status-codes";

const becomeGuaid = async (user: JwtPayload, payload: GuideInfo) => {
  const isExistUser = await prisma.user.findFirst({
    where: {
      email: user.email,
    },
  });

  if (!isExistUser) {
    throw new AppError(StatusCodes.NOT_FOUND, "user not found");
  }
  if (isExistUser.role === Role.GUIDE) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "you have already guaid profile"
    );
  }

  if (isExistUser.isDeleted) {
    throw new AppError(StatusCodes.BAD_REQUEST, "this user already deleted");
  }

  const result = await prisma.$transaction(async (tnx) => {
    const updateUserRole = await prisma.user.update({
      where: {
        id: isExistUser.id,
      },
      data: {
        role: Role.GUIDE,
      },
    });
    const guaid = await prisma.guideInfo.create({
      data: {
        ...payload,
        userId: user.userId,
      },
    });
    return guaid;
  });
  return result;
};

const getAllPopularGuaid = async () => {
  const result = await prisma.user.findMany({
    where: {
      role: "GUIDE",
      isDeleted: false,
      status: "ACTIVE",
    },
    select: {
      profilePhoto: true,
      name: true,
      email: true,
      bio: true,
    },
  });
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, "not popular guaid found");
  }
  return result;
};

export const guaidServices = {
  becomeGuaid,
  getAllPopularGuaid,
};
