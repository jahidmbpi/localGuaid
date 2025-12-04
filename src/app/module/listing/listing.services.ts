import { Listing } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../config/prisma";
import AppError from "../../helper/appError";

const createListing = async (
  user: JwtPayload,
  payload: Listing,
  files: Express.Multer.File[]
) => {
  if (!user?.userId) {
    throw new AppError(401, "Unauthorized");
  }
  if (user.role !== "GUIDE") {
    throw new AppError(403, "Only guides can create a listing");
  }

  const images = files.map((file) => file.path) || [];
  console.log("from services", payload);
  const result = await prisma.listing.create({
    data: {
      ...payload,
      guideId: user.userId,
      images,
    },
  });
  return result;
};

export const listingServices = {
  createListing,
};
