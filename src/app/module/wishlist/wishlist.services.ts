import { prisma } from "../../config/prisma";
import AppError from "../../helper/appError";
import { StatusCodes } from "http-status-codes";

const addToWishlist = async (userId: string, listingId: string) => {
  const listingExists = await prisma.listing.findUnique({
    where: { id: listingId },
  });

  if (!listingExists) {
    throw new AppError(StatusCodes.NOT_FOUND, "Tour listing not found");
  }

  // Check if already wishlisted
  const alreadyWishlisted = await prisma.wishlist.findUnique({
    where: {
      userId_listingId: {
        userId,
        listingId,
      },
    },
  });

  if (alreadyWishlisted) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Listing is already in your wishlist");
  }

  const result = await prisma.wishlist.create({
    data: {
      userId,
      listingId,
    },
    include: {
      listing: true,
    },
  });

  return result;
};

const removeFromWishlist = async (userId: string, listingId: string) => {
  const wishlistEntry = await prisma.wishlist.findUnique({
    where: {
      userId_listingId: {
        userId,
        listingId,
      },
    },
  });

  if (!wishlistEntry) {
    throw new AppError(StatusCodes.NOT_FOUND, "Wishlist entry not found");
  }

  const result = await prisma.wishlist.delete({
    where: {
      userId_listingId: {
        userId,
        listingId,
      },
    },
  });

  return result;
};

const getMyWishlist = async (userId: string) => {
  const result = await prisma.wishlist.findMany({
    where: {
      userId,
    },
    include: {
      listing: {
        include: {
          guide: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

export const wishlistServices = {
  addToWishlist,
  removeFromWishlist,
  getMyWishlist,
};
