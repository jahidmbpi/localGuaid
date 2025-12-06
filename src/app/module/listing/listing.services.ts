import { Listing, Role } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../config/prisma";
import AppError from "../../helper/appError";
import { StatusCodes } from "http-status-codes";

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

  const result = await prisma.listing.create({
    data: {
      ...payload,
      guideId: user.userId,
      images,
    },
  });
  return result;
};

const getAllLising = async () => {
  const result = await prisma.listing.findMany();
  return result;
};

const UpdateListing = async (
  paylod: Partial<Listing>,
  listingId: string,
  user: JwtPayload
) => {
  const isExistListing = await prisma.listing.findFirst({
    where: {
      id: listingId,
    },
    include: {
      guide: true,
    },
  });
  console.log(isExistListing);
  console.log(paylod);
  console.log(listingId);

  if (!isExistListing) {
    throw new AppError(StatusCodes.NOT_FOUND, "listing not found");
  }

  if (user.role !== Role.GUIDE) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "Only guides can create a listing"
    );
  }

  const isExistGuid = await prisma.user.findFirst({
    where: {
      id: isExistListing.guideId,
    },
  });
  if (!isExistGuid) {
    throw new AppError(StatusCodes.NOT_FOUND, "guaid not found");
  }
  if (isExistGuid.role !== user.role) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      "you are not authorized for this route"
    );
  }

  const result = await prisma.listing.update({
    where: {
      id: listingId,
    },
    data: paylod,
  });
  return result;
};

const deleteListing = async (lisTingId: string, user: JwtPayload) => {
  const isExistListing = await prisma.listing.findFirst({
    where: {
      id: lisTingId,
    },
  });

  if (!isExistListing) {
    throw new AppError(StatusCodes.NOT_FOUND, "listing not found ");
  }

  if (isExistListing.isActive) {
    throw new AppError(StatusCodes.BAD_REQUEST, "this listing already block");
  }

  if (isExistListing.guideId !== user.UserId) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      "you are not permited for this route"
    );
  }
  const deleteListing = await prisma.listing.delete({
    where: {
      id: lisTingId,
    },
  });
  return deleteListing;
};
export const listingServices = {
  createListing,
  UpdateListing,
  deleteListing,
  getAllLising,
};
